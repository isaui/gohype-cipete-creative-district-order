import { createClient } from "@/utils/supabase/server"
import { convertToPage, convertToSection, fetchSummaryData } from "./utils"
import TicketSection from "./sections/TicketSection"
import OrderSection from "./sections/OrderSection"
import Navbar from "@/components/shared/Navbar"
import LoginSection from "./sections/LoginSection"
import { Lock } from "lucide-react"
import SummarySection from "./sections/SummarySection"

type DashboardModuleProps = {
    eventPath?: string
    section?: string
    page?: string
}

const DashboardModule: React.FC<DashboardModuleProps> = async ({eventPath, section, page}) => {
    let isAdminAndAuthenticated = false
    const dashboardSection = convertToSection(section);
    const supabase = createClient()
    const userResponse = await supabase.auth.getUser()
    if(userResponse.data.user){
       const queryUser = await supabase.from("user").select("*").eq("id", userResponse.data.user.id).single();
       if(queryUser.data && queryUser.data.role == 'ADMIN'){
        isAdminAndAuthenticated = true
       } 
    }


    const pageNumber = convertToPage(page)

    if (!isAdminAndAuthenticated) {
        return (
            <div className="flex flex-col w-screen min-h-screen bg-background items-center justify-center">
                <Navbar isAuthRequired={true}/>
                <div className="max-w-md p-8 flex flex-col bg-white rounded-lg shadow-lg items-center text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
                    <p className="text-gray-600 mb-6">
                        {`We're sorry, but you don't have permission to access this page. 
                        This area is restricted to administrators only.`}
                    </p>
                    <div className="flex w-full   mb-6 justify-center items-center">
                    <Lock className="w-12 h-auto "/>
                    </div>
                    <LoginSection/>
                </div>
            </div>
        )
    }


    return (
        <div className="flex flex-col w-screen min-h-screen bg-background items-center pt-16 pb-10">
            <Navbar isAuthRequired={true}/>
            <SummarySection ticketPath={eventPath??""}/>
            <div className="flex w-full mx-auto max-w-7xl items-center px-4 mt-8 mb-4">
               {
                <h1 className="text-2xl font-bold">Cipete Creative District</h1>
               }
            </div>
            {
                dashboardSection == 'order'?  
                <OrderSection ticketPath={eventPath} page={pageNumber}/> : 
                <TicketSection ticketPath={eventPath} page={pageNumber}/>
            }
        </div>
    )
}

export default DashboardModule