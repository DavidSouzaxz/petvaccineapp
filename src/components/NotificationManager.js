import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Platform } from "react-native";

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

  // Ativa ou Desativa no AsyncStorage e gerencia o sistema
  toggleNotificationSetting: async (enable) => {
    try {
      if (enable) {
        const hasPermission = await NotificationManager.requestPermissions();
        if (!hasPermission) return false;

        await AsyncStorage.setItem("@notificationsEnabled", "true");
        return true;
      } else {
        // Se desativar, limpa todas as notificações locais agendadas para o futuro
        await Notifications.cancelAllScheduledNotificationsAsync();
        await AsyncStorage.setItem("@notificationsEnabled", "false");
        return false;
      }
    } catch (error) {
      console.error("Erro ao salvar configuração de notificação:", error);
      return false;
    }
  },

  // Só agenda se estiver "true" no AsyncStorage
  scheduleVaccineReminder: async (
    petName,
    vaccineName,
    nextApplicationDate,
    isApplied,
  ) => {
    try {
      const isGeneralEnabled = await AsyncStorage.getItem(
        "@notificationsEnabled",
      );
      const isVaccineEnabled = await AsyncStorage.getItem(
        "@notificationsEnabledVaccine",
      );

      if (isGeneralEnabled !== "true" || isVaccineEnabled !== "true") {
        console.log("Agendamento cancelado: Notificações desativadas.");
        return;
      }

      const nextDate = new Date(nextApplicationDate);
      const now = new Date();

      let reminderDate = new Date(nextDate);
      let title = "";
      let body = "";
      let triggerInput = null;

      // 🛑 CENÁRIO 1: VACINA NÃO FOI APLICADA (isApplied === false)
      if (!isApplied) {
        if (nextDate < now) {
          // 🔴 ATRASADA: Usa o formato de segundos puros para blindar contra falhas de timezone nativas
          title = `Vacina Atrasada! ⚠️`;
          body = `A vacina ${vaccineName} do ${petName} está atrasada. Vamos agendar a aplicação para manter a proteção? 🐾`;

          triggerInput = {
            type: "timeInterval",
            seconds: 10,
            repeats: false,
          };
        } else {
          // 🟡 PRÓXIMA: Se está no futuro mas pendente, checa se falta menos de 3 dias
          reminderDate.setDate(reminderDate.getDate() - 3);
          if (reminderDate <= now) {
            reminderDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Amanhã
          }
          title = `Lembrete de Vacina 🗓️`;
          body = `A dose de ${vaccineName} do ${petName} está próxima! Não se esqueça de atualizar o PetCard.`;
          triggerInput = reminderDate;
        }
      }
      // 🟢 CENÁRIO 2: VACINA JÁ FOI APLICADA (isApplied === true)
      else {
        // Alerta padrão de antecedência para a PRÓXIMA dose programada
        reminderDate.setDate(reminderDate.getDate() - 3);

        if (reminderDate <= now) {
          reminderDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Amanhã
        }

        const messages = [
          {
            title: `Próxima dose do ${petName} 🐾`,
            body: `A data da nova dose de ${vaccineName} está chegando! Vamos manter a saúde em dia? ❤️`,
          },
          {
            title: `Proteção programada! 🛡️`,
            body: `Falta pouco para a próxima aplicação de ${vaccineName} do ${petName}. Fique atento à data!`,
          },
        ];
        const randomMessage =
          messages[Math.floor(Math.random() * messages.length)];
        title = randomMessage.title;
        body = randomMessage.body;
        triggerInput = reminderDate;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: triggerInput,
      });

      console.log(
        `[EAS Push] Notificação de vacina (${isApplied ? "Assegurada" : "Pendente"}) enviada para o motor do sistema.`,
      );
    } catch (error) {
      console.error("Erro ao agendar notificação baseada em regras:", error);
    }
  },

  // Dispara a confirmação de teste de login
  sendWelcomeNotification: async (userName) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Seja bem-vindo, ${userName}! 🐾`,
          body: "O PetCard está pronto para cuidar da saúde dos seus melhores amigos. Obrigado por entrar! ❤️",
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        // 👈 CORRIGIDO: Passando a string "timeInterval" direta para evitar erros de referência nula
        trigger: {
          type: "timeInterval",
          seconds: 2,
          repeats: false,
        },
      });
      console.log("Notificação de boas-vindas agendada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar notificação de boas-vindas:", error);
    }
  },
};
