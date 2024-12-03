import type { Account, AccountResponse, IGoFilter, IErrorResponse } from "@/types";
import { defineStore } from "pinia";
import type { Ref } from "vue";
import { ref } from "vue";
import { useGoRequest } from "@/composables/go-request";
import { useNotificationsStore } from "@/stores/notifications";
import { useCommonsStore } from "../../../stores/commons";
import { AxiosError } from "axios";
import type { AccountResponseInterface, AccountsData, IResendVerificationPayload } from "@/domain/accounts/types";

// Dummy Data for testing
const dummyUserAccounts: Account[] = [
  { 
    firstName: "John", lastName: "Doe", middleNames: "M", username: "john.doe@example.com", 
    phone: "123-456-7890", role: "public", createdAt: "2021-01-01", 
    emailVerified: true, phoneVerified: true, activatedAt: "2021-01-01"
  },
  { 
    firstName: "Jane", lastName: "Smith", middleNames: "A", username: "jane.smith@example.com", 
    phone: "234-567-8901", role: "public", createdAt: "2021-02-01", 
    emailVerified: true, phoneVerified: false, activatedAt: "2021-02-01"
  }
];

const dummyBackofficeAccounts: Account[] = [
  { 
    firstName: "Admin", lastName: "User", middleNames: "B", username: "admin.user@example.com", 
    phone: "345-678-9012", role: "admin", createdAt: "2021-03-01", 
    emailVerified: true, phoneVerified: true, activatedAt: "2021-03-01"
  },
  { 
    firstName: "Support", lastName: "Agent", middleNames: "C", username: "support.agent@example.com", 
    phone: "456-789-0123", role: "admin", createdAt: "2021-04-01", 
    emailVerified: true, phoneVerified: true, activatedAt: "2021-04-01"
  }
];

export const useAccounts = defineStore("user-management", () => {
  const response: Ref<AccountResponse | undefined> = ref();
  const userAccounts: Ref<Account[]> = ref([]);
  const backofficeAccounts: Ref<Account[]> = ref([]);

  const request = useGoRequest();
  const notify = useNotificationsStore();
  const commons = useCommonsStore();

  // Simulating account creation
  const createAccount = async (payload: any) => {
    return new Promise((resolve) => {
      resolve({ data: "Account created" });
    });
  }

  // Fetch dummy user accounts
  const fetchUserAccounts = async (filter: IGoFilter) => {
    // Here you would normally process the filter if you had real data
    userAccounts.value = dummyUserAccounts;
  }

  // Fetch dummy backoffice accounts
  const fetchBackofficeAccounts = async (filter: IGoFilter) => {
    // Here you would normally process the filter if you had real data
    backofficeAccounts.value = dummyBackofficeAccounts;
  }

  // Simulating resend account verification
  const resendAccountVerification = async (payload: IResendVerificationPayload) => {
    return new Promise((resolve) => {
      if (payload.purpose === "email") {
        notify.success(`An account verification email has been sent to ${payload.username.toLowerCase()}`);
      } else if (payload.purpose === "phone") {
        notify.success(`An OTP has been sent to the phone number associated with ${payload.username.toLowerCase()}`);
      } else if (payload.purpose === "change-password") {
        notify.success(`A password reset email has been sent to ${payload.username.toLowerCase()}`);
      }
      resolve();
    });
  }

  return { 
    response, 
    userAccounts, 
    backofficeAccounts, 
    createAccount, 
    fetchBackofficeAccounts, 
    fetchUserAccounts, 
    resendAccountVerification 
  };
});
