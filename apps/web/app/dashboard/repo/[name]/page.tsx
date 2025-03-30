"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import axios from "axios"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function RepoDetails() {
  const { data: session } = useSession()
  const params = useParams();
//   const {repo} = params;
// console.log("params", params);
  const [issues, setIssues] = useState([])
  const [pullRequests, setPullRequests] = useState([])

  useEffect(() => {
    if (!session?.accessToken) return

    const fetchIssuesAndPRs = async () => {
      const headers = {
        Authorization: `Bearer ${session.accessToken}`,
      }

      const issuesRes = await axios.get(`https://api.github.com/repos/${session.user.name}-Dezloper/${params.name}/issues`, { headers })
      const prRes = await axios.get(`https://api.github.com/repos/${session.user.name}-Dezloper/${params.name}/pulls`, { headers })
      // console.log("iss", issuesRes);
      const issuesData = await issuesRes
      const prData = await prRes
    //   console.log("issues data", issuesData);

      setIssues(issuesData.data)
      setPullRequests(prData.data)
    }
    // console.log(session)
    fetchIssuesAndPRs()
  }, [session, params.name])

  if (!session) return <p>Loading...</p>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{params.name}</h1>

      <h2 className="text-xl mt-4">Issues:</h2>
      <div className="flex flex-col gap-2">
        {issues.length > 0 ? (
          issues.map((issue) => (
            <div key={issue.id} className="w-full flex justify-between items-center">
              <Link href={issue.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                {issue.title}
              </Link>
              <Button>+ Bounty</Button>
            </div>
          ))
        ) : (
          <p>No issues found</p>
        )}
      </div>

      <h2 className="text-xl mt-4">Pull Requests:</h2>
      <ul className="list-disc pl-6 mt-2">
        {pullRequests.length > 0 ? (
          pullRequests.map((pr) => (
            <li key={pr.id}>
              <a href={pr.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                {pr.title}
              </a>
            </li>
          ))
        ) : (
          <p>No pull requests found</p>
        )}
      </ul>
    </div>
  )
}