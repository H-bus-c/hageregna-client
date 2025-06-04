import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
   addBus,
   addBusDepartureTime,
   addBusType,
   addCity,
   addPayment,
   addRegion,
   addReserve,
   addReserveSeat,
   addRole,
   addRoute,
   addStatus,
   addUser,
   addZone,
   deleteBus,
   deleteBusDepartureTime,
   deleteBusType,
   deleteCity,
   deletePayment,
   deleteRegion,
   deleteReserve,
   deleteReserveSeat,
   deleteRole,
   deleteRoute,
   deleteStatus,
   deleteUser,
   deleteZone,
   fetchBus,
   fetchBusDepartureTime,
   fetchBusType,
   fetchCity,
   fetchDate,
   fetchPayment,
   fetchRegion,
   fetchReserve,
   fetchReserveSeat,
   fetchRole,
   fetchRoute,
   fetchStatus,
   fetchUser,
   fetchZone,
   updateBus,
   updateBusDepartureTime,
   updateBusType,
   updateCity,
   updatePayment,
   updateRegion,
   updateReserve,
   updateReserveSeat,
   updateRole,
   updateRoute,
   updateStatus,
   updateUser,
   updateZone,
} from './API';

// Fetch All Data
export const useBuss = () =>
   useQuery({
      queryKey: ['buss'],
      queryFn: fetchBus,
   });
export const useBusDepartureTimes = () =>
   useQuery({ queryKey: ['busDepartureTimes'], queryFn: fetchBusDepartureTime });
export const useBusTypes = () =>
   useQuery({
      queryKey: ['busTypes'],
      queryFn: fetchBusType,
   });
export const useCitys = () => useQuery({ queryKey: ['citys'], queryFn: fetchCity });
export const useDate = () => useQuery({ queryKey: ['dates'], queryFn: fetchDate });
export const usePayments = () => useQuery({ queryKey: ['payments'], queryFn: fetchPayment });
export const useRegions = () => useQuery({ queryKey: ['regions'], queryFn: fetchRegion });
export const useReserves = () => useQuery({
      queryKey: ['reserves'],
      queryFn: fetchReserve
   });
export const useReserveSeats = () =>
   useQuery({ queryKey: ['reserveSeats'], queryFn: fetchReserveSeat });
export const useRoles = () => useQuery({ queryKey: ['roles'], queryFn: fetchRole });
export const useRoutes = () =>
   useQuery({queryKey: ['routes'],queryFn: fetchRoute,});
export const useStatuses = () => useQuery({ queryKey: ['statuses'], queryFn: fetchStatus });
export const useUsers = () =>
   useQuery({
      queryKey: ['users'],
      queryFn: fetchUser,
   });
export const useZones = () => useQuery({ queryKey: ['zones'], queryFn: fetchZone });

// Add All Data
export const useAddBus = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: addBus,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['buss'] });
      },
   });
};
export const useAddBusDepartureTime = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: addBusDepartureTime,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['busDepartureTimes'] });
      },
   });
};
export const useAddBusType = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: addBusType,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['busTypes'] });
      },
   });
};
export const useAddCity = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: addCity,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['citys'] });
      },
   });
};
export const useAddPayment = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: addPayment,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['payments'] });
      },
   });
};
export const useAddRegion = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: addRegion,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['regions'] });
      },
   });
};
export const useAddReserve = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: addReserve,
      onSuccess: data => {
         queryClient.invalidateQueries({
            queryKey: ['reserves'],
         });
      },
   });
};
export const useAddReserveSeat = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: addReserveSeat,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['roles'] });
      },
   });
};
export const useAddRole = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: addRole,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['roles'] });
      },
   });
};
export const useAddRoute = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: addRoute,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['routes'] });
      },
   });
};
export const useAddStatus = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: addStatus,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['statuses'] });
      },
   });
};
export const useAddUser = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: addUser,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['users'] });
      },
   });
};
export const useAddZone = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: addZone,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['zones'] });
      },
   });
};

// Update All Data
export const useUpdateBus = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: updateBus,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['buss'] });
      },
   });
};
export const useUpdateBusDepartureTime = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: updateBusDepartureTime,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['busDepartureTimes'] });
      },
   });
};
export const useUpdateBusType = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: updateBusType,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['busTypes'] });
      },
   });
};
export const useUpdateCity = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: updateCity,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['citys'] });
      },
   });
};
export const useUpdatePayment = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: updatePayment,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['payments'] });
      },
   });
};
export const useUpdateRegion = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: updateRegion,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['regions'] });
      },
   });
};
export const useUpdateReserve = () => {
   return useMutation({
      mutationFn: updateReserve,
   });
};
export const useUpdateReserveSeat = () => {
   return useMutation({
      mutationFn: updateReserveSeat,
   });
};
export const useUpdateRole = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: updateRole,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['roles'] });
      },
   });
};
export const useUpdateRoute = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: updateRoute,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['routes'] });
      },
   });
};
export const useUpdateStatus = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: updateStatus,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['statuses'] });
      },
   });
};
export const useUpdateUser = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: updateUser,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['users'] });
      },
   });
};
export const useUpdateZone = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: updateZone,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['zones'] });
      },
   });
};

// Delete All Data
export const useDeleteBus = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: deleteBus,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['buss'] });
      },
   });
};
export const useDeleteBusDepartureTime = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: deleteBusDepartureTime,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['busDepartureTimes'] });
      },
   });
};
export const useDeleteBusType = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: deleteBusType,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['busTypes'] });
      },
   });
};
export const useDeleteCity = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: deleteCity,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['citys'] });
      },
   });
};
export const useDeletePayment = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: deletePayment,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['payments'] });
      },
   });
};
export const useDeleteRegion = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: deleteRegion,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['regions'] });
      },
   });
};
export const useDeleteReserve = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: deleteReserve,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['reserves'] });
      },
   });
};
export const useDeleteReserveSeat = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: deleteReserveSeat,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['reserveSeats'] });
      },
   });
};
export const useDeleteRole = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: deleteRole,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['roles'] });
      },
   });
};
export const useDeleteRoute = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: deleteRoute,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['routes'] });
      },
   });
};
export const useDeleteStatus = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: deleteStatus,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['statuses'] });
      },
   });
};
export const useDeleteUser = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: deleteUser,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['users'] });
      },
   });
};
export const useDeleteZone = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: deleteZone,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['zones'] });
      },
   });
};
