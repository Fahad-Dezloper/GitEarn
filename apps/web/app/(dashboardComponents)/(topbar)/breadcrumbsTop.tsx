/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { usePathname } from "next/navigation";
import { BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import React from 'react' 



export default function BreadcrumbsTop(){
  const router = useRouter();
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean); 

  const formatSegment = (segment: any) => {
    return segment
      .replace(/-/g, " ") 
      .replace(/\b\w/g, (char: any) => char.toUpperCase()); 
  };

    return (
          <>
          <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 md:hidden flex" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        
        <>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>

            {pathSegments.length > 2 ? (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>...</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{formatSegment(pathSegments[pathSegments.length - 1])}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              pathSegments.map((segment, index) => {
                const href = "/" + pathSegments.slice(0, index + 1).join("/");
                const isLast = index === pathSegments.length - 1;
                
                return (
                  <React.Fragment key={href}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{formatSegment(segment)}</BreadcrumbPage>
                      ) : (
                        // @ts-ignore
                        <BreadcrumbLink as={Link} href={href}>
                          {formatSegment(segment)}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                );
              })
            )}
          </BreadcrumbList>
        </>
      </div>
          </>   
    )
}