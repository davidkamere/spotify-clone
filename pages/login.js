import { getProviders, signIn } from "next-auth/react"

function Login({ providers }) {

    return (
        <div className="flex flex-col bg-black min-h-screen items-center justify-center py-2">
            <img className="w-52 mb-5" src="https://links.papareact.com/9xl" alt="" />

            {Object.values(providers).map((provider) => (
                <div key={provider.id}>
                    <button onClick={() => signIn(provider.id,  { callbackUrl: "/"})} className="bg-[#18D860] text-white p-5 rounded-full" >Login with {provider.name}</button>
                </div>
            ))}
        </div>
    )
}


export default Login


export async function getServerSideProps() {
    const providers = await getProviders();

    return {
        props: {
            providers
        }
    }
}