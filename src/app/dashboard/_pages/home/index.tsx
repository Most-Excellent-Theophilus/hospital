"use client"
import { usePatients } from "@/features/patient/patient.queries";
import PatientDashboard from "./top-bar-chat";
// import PatientDashboard from "./top-bar-chat";



const Accounts = () => {
    const { data, dataUpdatedAt, error, errorUpdateCount, errorUpdatedAt, failureCount, failureReason, fetchStatus, isEnabled,
        isError, isFetched, isFetchedAfterMount, isFetching, isLoading, isLoadingError, isPaused, isPending, isPlaceholderData, isRefetchError, isRefetching, isStale, isSuccess, promise, refetch, status
    } = usePatients();


    return (<div className="py-2 px-7">
        
     <PatientDashboard />
    </div>);
}

export default Accounts;