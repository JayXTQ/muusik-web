# muusik.app

This is the frontend for the muusik.app project. This will allow you to connect with the API for Muusik and manage your music with your friends.

## What is this built on?

This website is built on SvelteKit

## Contributing

If you would like to contribute to this project, please read further here on how to do so.

### Getting started

To get started with contributing to this project, you will need to have Node.JS installed on your machine. Install it via the [Node.JS Website](https://nodejs.org).

Once you have Node installed, you will need to fork the repository and clone it to your machine, you can use whatever to clone it. I recommend GitHub Desktop for Windows/MacOS users.

Once you have cloned the repository, you will need to install the dependencies. You can do so by running the following command in your terminal:

```bash
npm install
```

This will then install all the dependencies/libraries needed for this project.

### Running the project

> **Warning:** You will need to rename `.env.example` to `.env` and fill in the values for the environment variables before doing this. You will also need a supabase project with Discord OAuth enabled, learn how to set that up [here](https://supabase.com/docs/guides/auth/social-login/auth-discord).

To run the project, you will need to run the following command in your terminal:

```bash
npm run dev
```

This will then run the project and you will be able to access it on your localhost, for instance `http://localhost:5713` (this is default for sveltekit).

### Database

As this project uses supabase, you will need to make sure you have added the values for your supabase project into .env then we need to establish the creation of databases. Also if you haven't already, please configure discord oauth which is explained above. For the databases, I have already constructed the SQL queries you need to make inside of supabase to create the tables and the security policies these need to have.

```sql
create table playlist (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    name text,
    songs jsonb[],
    owner uuid default auth.uid()
);

alter table playlist enable row level security;

CREATE POLICY "Enable all for users based on owner id" 
    ON playlist
    USING (auth.uid() = owner);

CREATE POLICY "Enable read access for all users" 
    ON playlist
    FOR SELECT 
    USING (true);
```

### Making changes

Once you have made your changes, commit to your fork and then you can go and make a pull request back to the main repository. Once you have done this, I will review your changes and then merge them into the main repository if the changes are good. For more information about making pull requests, check on [GitHub's Docs](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests).

## Issues

If you find any issues with the project, please create an issue on the repository and I will look into it as soon as possible. For more information about creating issues, check on [GitHub's Docs](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-issues).
