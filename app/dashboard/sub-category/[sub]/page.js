'use client'
import { useParams } from "next/navigation";


const subCategories = () => {
    const params = useParams()
    const {sub} = params; 
    return(
        <div>
            subCategories : {sub}
        </div>
    )
}

export default subCategories; 