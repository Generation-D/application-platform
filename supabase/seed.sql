INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) (
        select
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            email_val,
            crypt ('password123', gen_salt ('bf')),
            current_timestamp,
            current_timestamp,
            current_timestamp,
            '{"provider":"email","providers":["email"]}',
            '{"email_verified": true}',
            current_timestamp,
            current_timestamp,
            '',
            '',
            '',
            ''
        FROM
            unnest(ARRAY['user1@test.com', 'user2@test.com', 'user3@test.com', 'user4@test.com', 'user5@test.com','user6@test.com','user7@test.com','viewer@test.com','admin@test.com']) AS email_val
    );

INSERT INTO
    auth.identities (
        id,
        user_id,
        provider_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) (
        select
            gen_random_uuid(),
            id,
            id,
            format('{"sub":"%s","email":"%s"}', id :: text, email) :: jsonb,
            'email',
            current_timestamp,
            current_timestamp,
            current_timestamp
        from
            auth.users
    );

UPDATE user_profiles_table SET userrole = 2 FROM auth.users
WHERE email IN ('viewer@test.com', 'user4@test.com', 'user5@test.com', 'user6@test.com', 'user7@test.com')
AND userid = id;

UPDATE user_profiles_table SET userrole = 3 FROM auth.users WHERE email = 'admin@test.com' AND userid = id;

UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object(
    'full_name', CASE email
        WHEN 'admin@test.com' THEN 'Mara Fischer'
        WHEN 'viewer@test.com' THEN 'Anna Weber'
        WHEN 'user1@test.com' THEN 'Lea Bergmann'
        WHEN 'user2@test.com' THEN 'David Richter'
        WHEN 'user3@test.com' THEN 'Aylin Demir'
        WHEN 'user4@test.com' THEN 'Jonas Keller'
        WHEN 'user5@test.com' THEN 'Sophie Nguyen'
        WHEN 'user6@test.com' THEN 'Lukas Hoffmann'
        WHEN 'user7@test.com' THEN 'Miriam Schneider'
    END
) WHERE email IN (
    'admin@test.com', 'viewer@test.com', 'user1@test.com', 'user2@test.com',
    'user3@test.com', 'user4@test.com', 'user5@test.com', 'user6@test.com', 'user7@test.com'
);

INSERT INTO application_table (
    applicationid,
    userid
)
SELECT
    gen_random_uuid(),
    id
FROM
    auth.users
WHERE
    email IN ('user1@test.com', 'user2@test.com', 'user3@test.com');

UPDATE application_table SET team_name = CASE users.email
    WHEN 'user1@test.com' THEN 'GreenHarbor'
    WHEN 'user2@test.com' THEN 'SolarNest'
    WHEN 'user3@test.com' THEN 'CareBridge'
    ELSE team_name
END FROM auth.users AS users WHERE application_table.userid = users.id;
