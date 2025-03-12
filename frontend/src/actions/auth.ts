"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { z } from "zod";

import Logger from "@/logger/logger";
import { getURL, isValidPassword } from "@/utils/helpers";
import { getSupabaseCookiesUtilClient, getSupabaseCookiesUtilClientAdmin } from "@/supabase-utils/cookiesUtilClient";

const log = new Logger("actions/auth");

export async function signUpUser(prevState: any, formData: FormData) {
  const schema = z.object({
    email: z.string().min(1),
    password: z.string().min(1),
    passwordConfirmation: z.string().min(1),
    legalConfirmation: z.string(),
    captchaToken: z.string().min(1),
  });
  const signUpFormData = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("confirm-password"),
    legalConfirmation: formData.get("confirm-legal"),
    captchaToken: formData.get("captcha"),
  });
  if (!signUpFormData.success) {
    log.error(JSON.stringify(signUpFormData.error));
    return { message: "User Registrierung fehlgeschlagen", status: "ERROR" };
  }

  if (signUpFormData.data.legalConfirmation != "on") {
    log.debug("Legal Confirmation must be accepted");
    return {
      message: "Du musst der Datenschutzerklärung zustimmen",
      status: "ERROR",
    };
  }
  if (!isValidPassword(signUpFormData.data.password)) {
    log.debug("Password Requirements don't match");
    return {
      message:
        "Das Passwort muss mind. 1 Goßbuchstaben, mind. 1 Kleinbuchstaben, mind. 1 Zahl, mind. 1 Sonderzeichen enthalten und 8-72 Zeichen lang sein!",
      status: "ERROR",
    };
  }

  if (
    signUpFormData.data.password != signUpFormData.data.passwordConfirmation
  ) {
    log.debug("Passwords don't match");
    return { message: `Passwörter stimmen nicht überein!`, status: "ERROR" };
  }
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    const { data: userData, error: userError } = await supabase.auth.signUp({
      email: signUpFormData.data.email.replace("@googlemail.com", "@gmail.com"),
      password: signUpFormData.data.password,
      options: {
        emailRedirectTo: `${getURL()}/auth/callback`,
        captchaToken: signUpFormData.data.captchaToken,
      },
    });
    revalidatePath("/login");
    if (userError) {
      log.error(JSON.stringify(userError));
      return { message: userError.message, status: "ERROR" };
    }

    if (
      userData.user &&
      userData.user.identities &&
      userData.user.identities.length === 0
    ) {
      log.debug("It already exists an Profile with this Email Address.");
      return {
        message: "Es existiert bereits ein Profil mit dieser Email Adresse!",
        status: "ERROR",
      };
    }
    const supabaseAdmin = await getSupabaseCookiesUtilClientAdmin()
    const { error: userProfileError } = await supabaseAdmin
      .from("user_profiles_table")
      .insert({ userid: userData.user!.id, userrole: 1, isactive: true });
    if (userProfileError) {
      if (userProfileError.code == "23505") {
        log.debug("User already registered. Resent Confirmation Email");
        return {
          message:
            "Der User war zwar bereits registriert, dir wurde jedoch erneut eine Email gesendet, bitte schau in dein Postfach!",
          status: "SUCCESS",
        };
      }
      log.error(JSON.stringify(userProfileError));
      return { message: userProfileError.message, status: "ERROR" };
    }
    const sendData = { userid: userData!.user!.id };
    const { error: applicationError } = await supabaseAdmin
      .from("application_table")
      .insert(sendData);
    if (applicationError) {
      log.error(JSON.stringify(applicationError));
      return { message: applicationError.message, status: "ERROR" };
    }
    log.info(`Signed Up the following User: ${userData.user?.email}`);
    return {
      message: `Wir haben dir eine Email geschickt!`,
      status: "SUCCESS",
    };
  } catch (error) {
    log.error(JSON.stringify(error));
    return {
      message: "Etwas ist schief gelaufen, bitte probiere es nocheinmal.",
      status: "ERROR",
    };
  }
}

export async function signInUser(prevState: any, formData: FormData) {
  const schema = z.object({
    email: z.string().min(1),
    password: z.string().min(1),
    captchaToken: z.string().min(1),
  });
  const signInFormData = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    captchaToken: formData.get("captcha"),
  });

  if (!signInFormData.success) {
    log.error(JSON.stringify(signInFormData.error));
    return { message: "User Login fehlgeschlagen" };
  }

  try {
    const supabase = await getSupabaseCookiesUtilClient();
    console.log(signInFormData.data.captchaToken);
    const { data: userData, error: userError } =
      await supabase.auth.signInWithPassword({
        email: signInFormData.data.email.replace(
          "@googlemail.com",
          "@gmail.com"
        ),
        password: signInFormData.data.password,
        options: {
          captchaToken: signInFormData.data.captchaToken,
        },
      });
    if (userError) {
      if (userError.status == 400) {
        log.debug("Invalid Login Credentials");
        return { message: "Deine Login Daten sind ungültig!" };
      }
      log.error(JSON.stringify(userError));
      return { message: `Fehler: ${userError.message}` };
    }
    const { data: profileData, error: profileError } = await supabase
      .from("user_profiles_table")
      .select("isactive")
      .eq("userid", userData.user.id)
      .single();
    if (profileError) {
      log.error(JSON.stringify(profileError));
      return { message: `Fehler: ${profileError.message}` };
    }
    if (profileData && !profileData.isactive) {
      log.error(`Deactivated User (${userData.user.email}) tried to login`);
      await supabase.auth.signOut();
      return {
        message:
          "Dein User wurde deaktiviert, bitte kontaktiere uns über 'it-ressort@generation-d.org'!",
      };
    }
    revalidatePath("/");
  } catch (error) {
    log.error(JSON.stringify(error));
    return {
      message: "Etwas ist schief gelaufen. Bitte probiere es nocheinmal",
    };
  }
  redirect("/");
}

export async function sendResetPasswordLink(
  prevState: any,
  formData: FormData,
) {
  const schema = z.object({
    email: z.string().min(1),
    captchaToken: z.string().min(1),
  });
  const resetPasswordFormData = schema.safeParse({
    email: formData.get("email"),
    captchaToken: formData.get("captcha"),
  });

  if (!resetPasswordFormData.success) {
    log.error(JSON.stringify(resetPasswordFormData.error));
    return { message: "Passwort zurücksetzen fehlgeschlagen", status: "ERROR" };
  }
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    const email = resetPasswordFormData.data.email.replace(
      "@googlemail.com",
      "@gmail.com",
    );
    const { error: PasswordResetError } =
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getURL()}/auth/callback?next=login/update-password`,
        captchaToken: resetPasswordFormData.data.captchaToken,
      });
    if (PasswordResetError) {
      log.error(JSON.stringify(PasswordResetError));
      return { message: PasswordResetError.message, status: "ERROR" };
    }
    revalidatePath("/login");
    log.info(`Reset Password for ${email}`);
    return {
      message: `Wenn du einen Account bei uns besitzt wurde dir ein Passwort Zurücksetzen Link gesendet!`,
      status: "SUCCESS",
    };
  } catch (error) {
    log.error(JSON.stringify(error));
    return {
      message: "Etwas ist schief gelaufen. Bitte probiere es nocheinmal",
      status: "ERROR",
    };
  }
}

export async function deleteUser(): Promise<{
  message: string;
  status: string;
}> {
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      log.error(JSON.stringify(userError));
      return { message: userError.message, status: "ERROR" };
    }
    log.info(`Deleting User ${userData.user.email}`);
    const supabaseAdmin = await getSupabaseCookiesUtilClientAdmin()
    const { error: deleteUserError } =
      await supabaseAdmin.auth.admin.deleteUser(userData.user!.id);
    if (deleteUserError) {
      log.error(JSON.stringify(deleteUserError));
      return { message: deleteUserError.message, status: "ERROR" };
    }
    revalidatePath("/");
  } catch (error) {
    log.info(JSON.stringify(error));
    return {
      message: "Es ist ein Fehler aufgetreten, probiere es nocheinmal!",
      status: "ERROR",
    };
  }
  log.info("Successfully deleted User!");
  return {
    message: "Der User wurde erfolgreich gelöscht!",
    status: "SUCCESS",
  };
}

export async function updatePassword(prevState: any, formData: FormData) {
  const schema = z.object({
    // For Implementation with Old Password Check: https://github.com/orgs/supabase/discussions/4042#discussioncomment-1707356
    //old_password: z.string().min(1),
    new_password: z.string().min(1),
    reenter_password: z.string().min(1),
  });
  const updatePasswordFormData = schema.safeParse({
    //old_password: formData.get("old_password"),
    new_password: formData.get("new_password"),
    reenter_password: formData.get("reenter_password"),
  });
  if (!updatePasswordFormData.success) {
    log.error(JSON.stringify(updatePasswordFormData.error));
    return { message: "Passwort updaten fehlgeschlagen", status: "ERROR" };
  }
  if (!isValidPassword(updatePasswordFormData.data.new_password)) {
    log.debug("Password Requirements don't match");
    return {
      message:
        "Das Passwort muss mind. 1 Goßbuchstaben, mind. 1 Kleinbuchstaben, mind. 1 Zahl, mind. 1 Sonderzeichen enthalten und 8-72 Zeichen lang sein!",
      status: "ERROR",
    };
  }
  if (
    updatePasswordFormData.data.new_password !=
    updatePasswordFormData.data.reenter_password
  ) {
    log.debug("Passwords don't match");
    return { message: "Passwörter stimmen nicht überein!", status: "ERROR" };
  }
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    const { error: userError } = await supabase.auth.updateUser({
      password: updatePasswordFormData.data.new_password,
    });
    if (userError) {
      if (
        userError.message ==
        "New password should be different from the old password."
      ) {
        log.debug("Old and new Passwords have to differ.");
        return {
          message:
            "Dein neues Passwort muss sich vom vorherigen Passwort unterscheiden!",
          status: "ERROR",
        };
      }
      JSON.stringify(userError);
      return { message: userError.message, status: "ERROR" };
    }
    revalidatePath("/");
  } catch (error) {
    log.error(JSON.stringify(error));
    return {
      message: "Es ist ein Fehler aufgetreten, probiere es nocheinmal!",
      status: "ERROR",
    };
  }
  log.info("Successfully updated Password.");
  redirect("/");
}

export async function signInWithSlack() {
  const supabase = await getSupabaseCookiesUtilClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "slack_oidc",
    options: {
      redirectTo: `${getURL()}auth/admin/callback/`,
    },
  });

  if (error) {
    log.error(JSON.stringify(error));
    throw error;
  }
  if (data && data.url) {
    NextResponse.redirect(data.url);
  }
}

export async function signInWithMagicLink(prevState: any, formData: FormData) {
  const schema = z.object({
    magicLinkEmail: z.string().min(1),
  });

  const signInFormData = schema.parse({
    magicLinkEmail: formData.get("magicLinkEmail"),
  });

  const supabase = await getSupabaseCookiesUtilClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: signInFormData.magicLinkEmail!,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${getURL()}auth/admin/callback/`,
    },
  });
  if (error) {
    log.error(JSON.stringify(error));
    throw error;
  }
}

export async function sendResetPasswordLinkFromSettings(
  prevState: any,
  formData: FormData,
) {
  const email = prevState.email;
  try {
    const supabase = await getSupabaseCookiesUtilClient();
    const { error: PasswordResetError } =
      await supabase.auth.resetPasswordForEmail(
        email.replace("@googlemail.com", "@gmail.com"),
        {
          redirectTo: `${getURL()}/auth/callback?next=login/update-password`,
        },
      );
    if (PasswordResetError) {
      log.error(JSON.stringify(PasswordResetError));
      return { message: PasswordResetError.message, status: "ERROR" };
    }
    revalidatePath("/login");
    log.info(`Reset Password for ${email}`);
    return {
      message: `Dir wurde ein Passwort Zurücksetzen Link gesendet!`,
      status: "SUCCESS",
    };
  } catch (error) {
    log.error(JSON.stringify(error));
    return {
      message: "Es ist ein Fehler aufgetreten, probiere es nocheinmal!",
      status: "ERROR",
    };
  }
}
