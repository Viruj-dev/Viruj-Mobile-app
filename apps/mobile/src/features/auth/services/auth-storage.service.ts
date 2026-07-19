const REFRESH_TOKEN_KEY = "viruj.auth.refreshToken";
const INSTALLATION_ID_KEY = "viruj.auth.installationId";

export type SecureStorageAdapter = {
  getItemAsync(key: string): Promise<string | null>;
  setItemAsync(key: string, value: string): Promise<void>;
  deleteItemAsync(key: string): Promise<void>;
};

async function getSecureStore(): Promise<SecureStorageAdapter> {
  return import("expo-secure-store");
}

const secureStoreAdapter: SecureStorageAdapter = {
  async getItemAsync(key) {
    return (await getSecureStore()).getItemAsync(key);
  },
  async setItemAsync(key, value) {
    return (await getSecureStore()).setItemAsync(key, value);
  },
  async deleteItemAsync(key) {
    return (await getSecureStore()).deleteItemAsync(key);
  },
};

export function createAuthStorage(adapter: SecureStorageAdapter) {
  return {
    getRefreshToken() {
      return adapter.getItemAsync(REFRESH_TOKEN_KEY);
    },
    setRefreshToken(refreshToken: string) {
      return adapter.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    },
    clearRefreshToken() {
      return adapter.deleteItemAsync(REFRESH_TOKEN_KEY);
    },
    getInstallationId() {
      return adapter.getItemAsync(INSTALLATION_ID_KEY);
    },
    setInstallationId(installationId: string) {
      return adapter.setItemAsync(INSTALLATION_ID_KEY, installationId);
    },
    clearAuthStorage() {
      return adapter.deleteItemAsync(REFRESH_TOKEN_KEY);
    },
  };
}

export const authStorage = createAuthStorage(secureStoreAdapter);