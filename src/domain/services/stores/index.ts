
import {ref, type Ref} from "vue";
import {defineStore} from "pinia";
import api from "@/config/api";
import type {Service, ServiceResponseInterface, ServiceSpecification} from "@/domain/services/types";

export const useServicesStore = defineStore("services", () => {

  const createService = async (payload:any) => {
    return api.post<ServiceResponseInterface>("/registry/v1/create", payload)
        .then((response:any) => {
          createServiceResponse.value = response.data
    })
  }

  const createServiceSpec = async (payload:any) => {
    return api.post<ServiceResponseInterface>("/registry/v1/specs/create", payload)
        .then((response:any) => {
          createSpecificationResponse.value = response.data
        })
  }

  const updateServiceSpec = async (payload:any) => {
    return api.put<ServiceResponseInterface>("/registry/v1/specs/update", payload)
        .then((response:any) => {
          createSpecificationResponse.value = response.data
        })
  }

  const editService = async (id:string, payload:any) => {
    return api.put<ServiceResponseInterface>("/registry/v1/update/"+id, payload)
        .then((response:any) => {
          updateServiceResponse.value = response.data
        })
  }

  // const fetchServices = async (page:number, limit:number) => {
  //   return api.get("/registry/v1?page="+page+"&limit="+limit).then((response:any) => {
  //     services.value = response.data.data
  //   })
  // }

  const fetchServicesByProvider = async (id:string, page:number) => {
    return api.get("/registry/v1/provider/"+id+"?limit=15&page="+page).then((response:any) => {
      services.value = response.data.data
    })
  }

  const findServiceSpecById = async (id:any) => {
    return api.get("/registry/v1/specs/"+id+"/list").then((response:any) => {
      serviceSpecifications.value = response.data.data
    })
  }

  const findService = async (id:any) => {
    return api.get("/registry/v1/"+id).then((response:any) => {
      service.value = response.data.data
    })
  }




  const dummyServices: Service[] = [
    // {id: "1", name: "Post Office Account", description: "Open a Post Office Account", accessibilityTier: "Public", featureId: "1", requirements: ["National ID", "Passport"], providerId: "1", providerName: "Posta Uganda", createdAt: {Time: "2021-09-01", Valid: true}, status: "Active", currentVersionId: "1"},
    // {id: "2", name: "Agricultural Research", description: "Request for Agricultural Research", accessibilityTier: "Public", featureId: "2", requirements: ["National ID", "Passport"], providerId: "2", providerName: "National Agricultural Research Organization", createdAt: {Time: "2021-09-02", Valid: true}, status: "Active", currentVersionId: "2"},
    // {id: "3", name: "National ID Registration", description: "Apply for a National ID", accessibilityTier: "Public", featureId: "3", requirements: ["National ID", "Passport"], providerId: "3", providerName: "National Identification & Registration Authority", createdAt: {Time: "2021-09-03", Valid: true}, status: "Active", currentVersionId: "3"},
    {id: "1", name: "Land Title Registration", description: "Apply for a Land Title", accessibilityTier: "Public", featureId: "4", requirements: ["National ID", "Passport"], providerId: "1", providerName: "Ministry of Lands and Urban Development", createdAt: {Time: "2021-09-04", Valid: true}, status: "Inactive", currentVersionId: "1"},
    {id: "2", name: "Name Reservation", description: "Reserve a Business Name", accessibilityTier: "Public", featureId: "5", requirements: ["National ID", "Passport"], providerId: "2", providerName: "URSB", createdAt: {Time: "2021-09-05", Valid: true}, status: "Inactive", currentVersionId: "2"},
    {id: "3", name: "Passport Application", description: "Apply for a Passport", accessibilityTier: "Public", featureId: "6", requirements: ["National ID", "Passport"], providerId: "3", providerName: "Ministry of Internal Affairs", createdAt: {Time: "2021-09-06", Valid: true}, status: "Inactive", currentVersionId: "3"},
    {id: "4", name: "Driver's Permit Application", description: "Apply for a Driver's Permit", accessibilityTier: "Public", featureId: "7", requirements: ["National ID", "Passport"], providerId: "4", providerName: "Ministry of Works and Transport", createdAt: {Time: "2021-09-07", Valid: true}, status: "Inactive", currentVersionId: "4"},
  ];

  // const dummySubscribedServices: Ref<Service[]> = ref([]);

  const dummySubscribedServices: Service[] = [
    {id: "5", name: "Post Office Account", description: "Open a Post Office Account", accessibilityTier: "Public", featureId: "5", requirements: ["National ID", "Passport"], providerId: "5", providerName: "Posta Uganda", createdAt: {Time: "2021-09-01", Valid: true}, status: "Active", currentVersionId: "5"},
    {id: "6", name: "Agricultural Research", description: "Request for Agricultural Research", accessibilityTier: "Public", featureId: "6", requirements: ["National ID", "Passport"], providerId: "6", providerName: "National Agricultural Research Organization", createdAt: {Time: "2021-09-02", Valid: true}, status: "Active", currentVersionId: "6"},
    {id: "7", name: "National ID Registration", description: "Apply for a National ID", accessibilityTier: "Public", featureId: "7", requirements: ["National ID", "Passport"], providerId: "7", providerName: "National Identification & Registration Authority", createdAt: {Time: "2021-09-03", Valid: true}, status: "Active", currentVersionId: "7"},
  ];




    // const services: Ref<Service[] | undefined> = ref()
    const services: Ref<Service[] | undefined> = ref(dummyServices)
    const subscribedServices: Ref<Service[] | undefined> = ref(dummySubscribedServices)

  const service: Ref<Service | undefined> = ref()
  const serviceSpecification: Ref<ServiceSpecification | undefined> = ref()
  const serviceSpecifications: Ref<ServiceSpecification[] | undefined> = ref()
  const createServiceResponse: Ref<ServiceResponseInterface | undefined> = ref()
  const updateServiceResponse: Ref<ServiceResponseInterface | undefined> = ref()
  const statusUpdateResponse: Ref<ServiceResponseInterface | undefined> = ref()
  const createSpecificationResponse: Ref<ServiceResponseInterface | undefined> = ref()




  const findServiceSpec = async (id:string) => {
    return api.get("/registry/v1/specs/"+id).then((response:any) => {
      serviceSpecification.value = response.data.data
    })
  }

  const updateServiceSpecificationStatus = async (payload:any) => {
    return api.put<ServiceResponseInterface>("/registry/v1/specs/update/status", payload)
        .then((response:any) => {
          statusUpdateResponse.value = response.data
        })
  }

  // async function fetchFloatRequests(filter: any) {
  //   // Simulate API call
  //   // You can adjust this based on the filtering criteria or paging
  //   floatRequests.value = dummyFloatRequests;
  // }

  async function fetchServices (filter: any) {
    // Simulate API call
    // const response = await fetch(`/api/services?limit=${limit}&page=${page}`);
    // const data = await response.json();
    // Use dummy data for now
    services.value = dummyServices;
  }

  async function fetchSubscribedServices (filter: any) {
    // Simulate API call
    // const response = await fetch(`/api/services?limit=${limit}&page=${page}`);
    // const data = await response.json();
    // Use dummy data for now
    subscribedServices.value = dummySubscribedServices;
  }

  // function subscribe(serviceId: string) {
  //   try {
  //     store.subscribeToService(serviceId);
  //     notify.success("Service subscribed successfully!");
  //   } catch (error) {
  //     notify.error("Failed to subscribe to service: " + error.message);
  //   }
  // }

  // make subscribeToService function
  function subscribeToService(serviceId: string) {
    // Simulate API call
    // const response = await fetch(`/api/services/subscribe/${serviceId}`);
    // const data = await response.json();
    // Use dummy data for now
    subscribedServices.value?.push(dummyServices.find((service) => service.id === serviceId));

    //set the status of the service to active
    services.value?.find((service) => service.id === serviceId)?.status === "Active";

    // filter it out of the services
    services.value = services.value?.filter((service) => service.id !== serviceId);
  }

  // unsubscribeFromService function
  function unsubscribeFromService(serviceId: string) {
    // Simulate API call
    // const response = await fetch(`/api/services/unsubscribe/${serviceId}`);
    // const data = await response.json();
    // Use dummy data for now
    services.value?.push(dummySubscribedServices.find((service) => service.id === serviceId));

    //set the status of the service to inactive
    subscribedServices.value?.find((service) => service.id === serviceId)?.status === "Inactive";

    // filter it out of the subscribed services
    subscribedServices.value = subscribedServices.value?.filter((service) => service.id !== serviceId);
  }

  return {
    services,
    subscribedServices,
    service,
    createServiceResponse,
    updateServiceResponse,
    createSpecificationResponse,
    serviceSpecification,
    serviceSpecifications,
    createService,
    fetchSubscribedServices,
    subscribeToService,
    unsubscribeFromService,
    createServiceSpec,
    updateServiceSpec,
    editService,
    fetchServices,
    findService,
    fetchServicesByProvider,
    findServiceSpec,
    findServiceSpecById,
    updateServiceSpecificationStatus
  };
})
