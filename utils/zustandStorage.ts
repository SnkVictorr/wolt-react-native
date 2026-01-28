// É uma storage nativa ultra rápida (bem mais rápida que AsyncStorage).
import { createMMKV } from "react-native-mmkv";

import { StateStorage } from "zustand/middleware";

/*Aqui você cria a instância do MMKV:

Ela representa o banco de dados local

Pode ser usada pra salvar, buscar e remover dados

Dá pra passar configs aqui (ex: id, criptografia), mas no seu caso está usando o padrão. */
const storage = createMMKV();

// Aqui você cria o adaptador pro Zustand usar o MMKV como storage
const zustandStorage: StateStorage = {
  // Função pra salvar um item na storage
  setItem: (name, value) => {
    return storage.set(name, value);
  },

  // Função pra buscar um item na storage
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },

  // Função pra remover um item da storage
  removeItem: (name) => {
    return storage.remove(name);
  },
};

export default zustandStorage;
