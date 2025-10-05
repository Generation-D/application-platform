INSERT INTO "user_roles_table" (userroleid, userrolename) VALUES (1, 'applicant'), (2, 'reviewer'), (3, 'admin');

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
            uuid_generate_v4 (),
            'authenticated',
            'authenticated',
            'user' || (ROW_NUMBER() OVER ()) || '@example.com',
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
            generate_series(1, 10)
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


INSERT INTO user_profiles_table (
    userid,
    userrole,
    isactive
)
SELECT
    id,
    1 AS userrole,
    TRUE AS isactive
FROM
    auth.users
WHERE
    email LIKE 'user%@example.com';


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