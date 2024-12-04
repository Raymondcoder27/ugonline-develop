import type { Account, AccountResponse, IGoFilter, IErrorResponse, ManagerAccount } from "@/types";
import { defineStore } from "pinia";
import type { Ref } from "vue";
import { ref } from "vue";
import { useGoRequest } from "@/composables/go-request";
import { useNotificationsStore } from "@/stores/notifications";
import { useCommonsStore } from "../../../stores/commons";
import { AxiosError } from "axios";
import type { AccountResponseInterface, AccountsData, IResendVerificationPayload } from "@/domain/accounts/types";



export const useAccounts = defineStore("user-management", () => {
  const response: Ref<AccountResponse | undefined> = ref();
  const userAccounts: Ref<Account[]> = ref([]);
  const backofficeAccounts: Ref<Account[]> = ref([]);
  const managerAccounts: Ref<ManagerAccount[]> = ref([]);

  const request = useGoRequest();
  const notify = useNotificationsStore();
  const commons = useCommonsStore();


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

// <th class="t-header" width="30%">Names</th>
// <th class="t-header">Email</th>
// <th class="t-header">Phone</th>
// <!-- <th class="text-center">Role</th> -->
// <th class="text-center">Status</th>
// <!-- <th class="text-center">Activation</th> -->
// <th class="text-center">Date</th>

const dummyManagerAccounts: ManagerAccount[] = [
  { 
    firstName: "Manager", lastName: "One", middleNames: "M", username: "James Doe", 
    phone: "123-456-7890", role: "manager", createdAt: "2021-01-01",
    emailVerified: true, phoneVerified: true, activatedAt: "2021-01-01",
    email: "managerone@gmail.com", status: "Active"
  },
  { 
    firstName: "Manager", lastName: "Two", middleNames: "A", username: "Jane Smith", 
    phone: "234-567-8901", role: "manager", createdAt: "2021-02-01",
    emailVerified: true, phoneVerified: false, activatedAt: "2021-02-01",
    email: "managertwo@gmail.com", status: "Active"
  },
  { 
    firstName: "Manager", lastName: "Three", middleNames: "B", username: "John Doe", 
    phone: "345-678-9012", role: "manager", createdAt: "2021-03-01",
    emailVerified: true, phoneVerified: true, activatedAt: "2021-03-01",
    email: "managerthree@gmail.com", status: "Active"
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

  // Simulating account creation
  const createAccount = async (payload: any) => {
    return new Promise((resolve) => {
      resolve({ data: "Account created" });
    });
  }

  // const addBranch = (newBranch: Branch) => {
  //   branches.value.push(newBranch); // Directly add the branch to the array
  // };

  const addManagerAccount = (newManager: ManagerAccount) => {
    managerAccounts.value.push(newManager); // Directly add the manager to the array
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

  // Fetch dummy manager accounts
  const fetchManagerAccounts = async (filter: IGoFilter) => {
    // Here you would normally process the filter if you had real data
    managerAccounts.value = dummyManagerAccounts;
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
    fetchManagerAccounts,
    resendAccountVerification 
  };
});
