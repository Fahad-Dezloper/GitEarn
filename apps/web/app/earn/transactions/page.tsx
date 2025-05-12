import react from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Topbar from '@/app/(dashboardComponents)/Topbar'
import {BountiesCreated} from '@/app/(dashboardComponents)/(transaction)/BountiesCreated'
import { BountiesClaimedPage} from '@/app/(dashboardComponents)/(transaction)/BountiesClaimed'

export default function Page(){
    return (
        <div className=''>
            <Topbar />
             <div className="flex flex-col gap-4 sm:gap-4 py-3 sm:py-4">
                <div className="flex flex-col gap-1 sm:gap-2">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-sora font-semibold">Transaction</h1>
                </div>

                <Tabs defaultValue="claimed" className="space-y-4">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="created">Bounties I Created</TabsTrigger>
                        <TabsTrigger value="claimed">Bounties I Claimed</TabsTrigger>
                    </TabsList>
                    <TabsContent value="created" className="space-y-4">
                        <BountiesCreated />
                    </TabsContent>
                    <TabsContent value="claimed" className="space-y-4">
                        <BountiesClaimedPage />
                    </TabsContent>
                    </Tabs>
                </div>
        </div>
    )
}