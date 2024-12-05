
import {ref, type Ref} from "vue";
import {defineStore} from "pinia";
import api from "@/config/api";
import type {Service, ServiceResponseInterface, ServiceSpecification} from "@/domain/services/types";

export const useServicesStore = defineStore("services", () => {
  // const services: Ref<Service[] | undefined> = ref()
  const services: Ref<Service[] | undefined> = ref()

  const service: Ref<Service | undefined> = ref()
  const serviceSpecification: Ref<ServiceSpecification | undefined> = ref()
  const serviceSpecifications: Ref<ServiceSpecification[] | undefined> = ref()
  const createServiceResponse: Ref<ServiceResponseInterface | undefined> = ref()
  const updateServiceResponse: Ref<ServiceResponseInterface | undefined> = ref()
  const statusUpdateResponse: Ref<ServiceResponseInterface | undefined> = ref()
  const createSpecificationResponse: Ref<ServiceResponseInterface | undefined> = ref()

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

  const fetchServices = async (page:number, limit:number) => {
    return api.get("/registry/v1?page="+page+"&limit="+limit).then((response:any) => {
      services.value = response.data.data
    })
  }

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

  // const services = ref<Service[]>([
  //   {
  //     id: 1,
  //     name: "Post Office Account",
  //     description: "Open a Post Office Account",
  //     // name: "Posta Uganda",
  //     // thumbnail: "/assets/coa-19c4edfc.png",
  //     // email: "info@ugapost.co.ug",
  //     // phone: "+256784944479",
  //     // address: "Plot 35 Kampala Road, Kampala",
  //   },
  //   {
  //     id: 2,
  //     name: "Agricultural Research",
  //     description: "Request for Agricultural Research",
  //     // name: "National Agricultural Research Organization",
  //     // thumbnail: "/assets/coa-19c4edfc.png",
  //     // email: "info@naro.go.ug",
  //     // phone: "+256-41-320512",
  //     // address: "Plot 11-13, Lugard Avenue, Entebbe",
  //   },
  //   {
  //     id: 3,
  //     name: "National ID Registration",
  //     description: "Apply for a National ID",
  //     // name: "National Identification & Registration Authority",
  //     // thumbnail: "/assets/coa-19c4edfc.png",
  //     // email: "info@nira.com",
  //     // phone: "0800211700",
  //     // address: "National Independence Grounds, Kololo Airstrip",
  //   },
  //   {
  //     id: 4,
  //     name: "Land Title Registration",
  //     description: "Apply for a Land Title",
  //     // name: "Ministry of Lands and Urban Development",
  //     // thumbnail: "/assets/coa-19c4edfc.png",
  //     // email: "info@mlhud.go.ug",
  //     // phone: "0414355355",
  //     // address: "Dewinton Road",
  //   },
  //   {
  //     id: 5,
  //     name: "Name Reservation",
  //     description: "Reserve a Business Name",
  //     // name: "URSB",
  //     // thumbnail: "/assets/coa-19c4edfc.png",
  //     // email: "ursb@ursb.go.ug",
  //     // phone: "0312211211",
  //     // address: "Plot 1 Baskerville Avenue",
  //   },
  //   {
  //     id: 9,
  //     name: "Passport Application",
  //     description: "Apply for a Passport",
  //     // name: "Ministry of Internal Affairs",
  //     // thumbnail: "/assets/coa-19c4edfc.png",
  //     // email: "info@moia.go.ug",
  //     // phone: "0312123123",
  //     // address: "",
  //   },
  //   // {
  //   //   id: 10,
  //   //   service: "Business Registration",
  //   //   description: "Register a Business",
  //   // },
  //   // {
  //   //   id: 11,
  //   //   service: "Company Registration",
  //   //   description: "Register a Company",
  //   // },
  //   // {
  //   //   id: 12,
  //   //   service: "e-Government Services",
  //   //   description: "Access e-Government Services",
  //   // },
  //   // {
  //   //   id: 13,
  //   //   service: "e-Procurement",
  //   //   description: "Access e-Procurement Services",
  //   // }
  // ]);

  // const dummyFloatAllocations: FloatAllocation[] = [
  //   { id: 1, dateAssigned: "2021-09-01", amount: 13000000, status: "Allocated", branch: "Branch 1" },
  //   { id: 2, dateAssigned: "2021-09-02", amount: 21000000, status: "Allocated", branch: "Branch 2" },
  //   { id: 3, dateAssigned: "2021-09-03", amount: 37000000, status: "Allocated", branch: "Branch 3" },
  // ];

  const dummyServices: Service[] = [
    {id: "1", name: "Post Office Account", description: "Open a Post Office Account", accessibilityTier: "Public", featureId: "1", requirements: ["National ID", "Passport"], providerId: "1", providerName: "Posta Uganda", createdAt: {Time: "2021-09-01", Valid: true}, status: "Active", currentVersionId: "1"},
    {id: "2", name: "Agricultural Research", description: "Request for Agricultural Research", accessibilityTier: "Public", featureId: "2", requirements: ["National ID", "Passport"], providerId: "2", providerName: "National Agricultural Research Organization", createdAt: {Time: "2021-09-02", Valid: true}, status: "Active", currentVersionId: "2"},
    {id: "3", name: "National ID Registration", description: "Apply for a National ID", accessibilityTier: "Public", featureId: "3", requirements: ["National ID", "Passport"], providerId: "3", providerName: "National Identification & Registration Authority", createdAt: {Time: "2021-09-03", Valid: true}, status: "Active", currentVersionId: "3"},
    {id: "4", name: "Land Title Registration", description: "Apply for a Land Title", accessibilityTier: "Public", featureId: "4", requirements: ["National ID", "Passport"], providerId: "4", providerName: "Ministry of Lands and Urban Development", createdAt: {Time: "2021-09-04", Valid: true}, status: "Active", currentVersionId: "4"},
    {id: "5", name: "Name Reservation", description: "Reserve a Business Name", accessibilityTier: "Public", featureId: "5", requirements: ["National ID", "Passport"], providerId: "5", providerName: "URSB", createdAt: {Time: "2021-09-05", Valid: true}, status: "Active", currentVersionId: "5"},
    {id: "6", name: "Passport Application", description: "Apply for a Passport", accessibilityTier: "Public", featureId: "6", requirements: ["National ID", "Passport"], providerId: "6", providerName: "Ministry of Internal Affairs", createdAt: {Time: "2021-09-06", Valid: true}, status: "Active", currentVersionId: "6"},
  ];



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

  return {
    services,
    service,
    createServiceResponse,
    updateServiceResponse,
    createSpecificationResponse,
    serviceSpecification,
    serviceSpecifications,
    createService,
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
