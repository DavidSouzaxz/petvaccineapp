import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Platform } from "react-native";

const ASYNC_STORAGE_KEY = "@notificationsEnabled";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NotificationManager = {
  // Pede permissão nativa do sistema
  requestPermissions: async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert("Aviso", "Permissão de notificação negada no sistema.");
      return false;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF7A00",
      });
    }

    return true;
  },

  // FUNÇÃO NOVA: Ativa ou Desativa no AsyncStorage e gerencia o sistema
  toggleNotificationSetting: async (enable) => {
    try {
      if (enable) {
        const hasPermission = await NotificationManager.requestPermissions();
        if (!hasPermission) return false;

        await AsyncStorage.setItem(ASYNC_STORAGE_KEY, "true");
        return true;
      } else {
        // Se desativar, limpa todas as notificações locais agendadas para o futuro
        await Notifications.cancelAllScheduledNotificationsAsync();
        await AsyncStorage.setItem(ASYNC_STORAGE_KEY, "false");
        return false;
      }
    } catch (error) {
      console.error("Erro ao salvar configuração de notificação:", error);
      return false;
    }
  },

  // AJUSTADA: Só agenda se estiver "true" no AsyncStorage
  scheduleVaccineReminder: async (
    petName,
    vaccineName,
    nextApplicationDate,
  ) => {
    try {
      const isEnabled = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);

      // Se estiver explicitamente "false" ou nulo (não configurado), ignora
      if (isEnabled !== "true") return;

      const vaccineDate = new Date(nextApplicationDate);
      const now = new Date();

      const reminderDate = new Date(vaccineDate);
      reminderDate.setDate(reminderDate.getDate() - 3); // 3 dias antes

      if (reminderDate <= now) {
        reminderDate.setTime(now.getTime() + 24 * 60 * 60 * 1000); // Amanhã
      }

      const messages = [
        {
          title: `Lembrete do ${petName} 🐾`,
          body: `A vacina ${vaccineName} está chegando! Vamos manter esse rabinho abanando saudável? ❤️`,
        },
        {
          title: `Proteção em dia! 🛡️`,
          body: `Falta pouco para a dose da ${vaccineName} do ${petName}. Não vá esquecer, hein tutor!`,
        },
      ];

      const randomMessage =
        messages[Math.floor(Math.random() * messages.length)];

      await Notifications.scheduleNotificationAsync({
        content: {
          title: randomMessage.title,
          body: randomMessage.body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: reminderDate,
      });

      console.log(`Notificação agendada para ${petName} em: ${reminderDate}`);
    } catch (error) {
      console.error("Erro ao agendar notificação:", error);
    }
  },
};
