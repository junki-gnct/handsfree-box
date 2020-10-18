declare module '*/firebaseConfig.json' {
  interface FirebaseConfig {
    api_key: string;
    auth_domain: string;
    databaseURL: string;
  }

  const value: FirebaseConfig;
  export = value;
}
