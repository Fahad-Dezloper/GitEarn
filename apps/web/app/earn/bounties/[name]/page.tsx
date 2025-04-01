export default function Page({params}: {params: {name: string}}) {
    return <div>Bounty {params.name}</div>
}