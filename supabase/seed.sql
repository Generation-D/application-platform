INSERT INTO "user_roles_table" (userroleid, userrolename) VALUES (1, 'applicant'), (2, 'reviewer'), (3, 'admin');

INSERT INTO auth.users (
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
)
SELECT
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    user_data.email,
    crypt('password123', gen_salt('bf')),
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
FROM (VALUES
    ('user1@example.com'),
    ('user2@example.com'),
    ('user3@example.com'),
    ('admin@example.com'),
    ('review@example.com')
) AS user_data(email);


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
            uuid_generate_v4 (),
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


UPDATE user_profiles_table
SET userrole = 3
WHERE userid IN (
    SELECT id FROM auth.users WHERE email = 'admin@example.com'
);

UPDATE user_profiles_table
SET userrole = 2
WHERE userid IN (
    SELECT id FROM auth.users WHERE email = 'review@example.com'
);


INSERT INTO application_table (
    applicationid,
    userid
)
SELECT
    uuid_generate_v4 (),
    id
FROM
    auth.users
WHERE
    email LIKE 'user%@example.com';
