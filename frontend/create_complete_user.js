// Script to add a user to Supabase with all necessary database entries
// This script creates a user that can immediately log in to the application
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Error: Required environment variables are missing.");
  console.error(
    "Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file.",
  );
  console.error(
    "Note: The SUPABASE_SERVICE_ROLE_KEY is different from the NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
  console.error(
    "You can find these values in your Supabase project settings under API.",
  );
  process.exit(1);
}

// Create a Supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createCompleteUser(email, password, name, userRole = 1) {
  try {
    console.log("Creating user with the following details:");
    console.log("- Email:", email);
    console.log("- Name:", name);
    console.log("- Role:", userRole);

    // Step 1: Create the user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true, // Automatically confirms the user's email
    });

    if (error) {
      console.error("Error creating user:", error.message);
      return null;
    }

    const userId = data.user.id;
    console.log("\nUser created successfully in Auth system!");
    console.log("User ID:", userId);
    console.log("Email:", data.user.email);
    console.log("Name:", data.user.user_metadata.name);

    // Step 2: Add entry to user_profiles_table
    console.log("\nAdding entry to user_profiles_table...");
    const { error: userProfileError } = await supabase
      .from("user_profiles_table")
      .insert({
        userid: userId,
        userrole: userRole,
        isactive: true,
      });

    if (userProfileError) {
      console.error("Error creating user profile:", userProfileError.message);
      return null;
    }
    console.log("User profile created successfully!");

    // Step 3: Add entry to application_table
    console.log("\nAdding entry to application_table...");
    const { error: applicationError } = await supabase
      .from("application_table")
      .insert({ userid: userId });

    if (applicationError) {
      console.error(
        "Error creating application entry:",
        applicationError.message,
      );
      return null;
    }
    console.log("Application entry created successfully!");

    console.log(
      "\n✅ User setup complete! The user can now log in to the application.",
    );
    return data.user;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
}

// Example usage
async function main() {
  if (process.argv.length < 5) {
    console.log(
      "Usage: node create_complete_user.js <email> <password> <name> [role]",
    );
    console.log(
      'Example: node create_complete_user.js user@example.com secure123 "John Doe" 1',
    );
    console.log("\nRole values (default is 1 if not specified):");
    console.log("1 - Regular user");
    console.log("2 - Admin (or other higher privilege level)");
    process.exit(1);
  }

  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4];
  const role = process.argv[5] ? parseInt(process.argv[5]) : 1;

  console.log(`\nAttempting to create a complete user in Supabase...\n`);
  await createCompleteUser(email, password, name, role);
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

// Execute e.g. with: node create_complete_user.js "test_user@example.com" "SecurePassword123!" "Test User"
