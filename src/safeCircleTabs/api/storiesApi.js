import axios from 'axios'

const api = axios.create({
    baseURL : 'http://localhost:4000/api'
});

// dont use this because the stories table will eventually have hundreds if not thousands of entries
export const getAllStories =  async () => {
    try{
        const result = await api.get("/stories");
        console.log(result.data);
        return result.data;
    }
    catch(error){
        if(error.response){
            console.log(error.message);
            return null;
        }
        if(error.request){
            
            console.log(error.message);
            return null;
        }
        console.log(error);
    }
}

export const getStoriesPaginated = async (limit = 2,page = 1) => {
    try{
        const result = await api.get(`/stories/fetchPaginated?limit=${limit}&page=${page}`);
        if(result.status == 200 && result.data)
        return result.data;
        else{
            console.log("no result");
        }
    }
    catch(error){
        console.log("get stories paginated error: " + error.message);
        return {err:error};
    }

}
export const getStory  = async (id) => {
    try{
        const result = await api.get(`/stories/${id}`);
        if(result.status == 200){
            return result.data;
        }else{
            console.log("error");
        }
    }catch(error){
        console.log(error);
    }
}
export const getStories = async (categoryId) =>{
    try{
        const result = await api.get(`/categories/${categoryId}/stories`);
        if(result.status == 200){
            return result.data;
        }else{
            console.log("error");
        }
    }catch(error){
        console.log(error);
    }
}
export const getAllcategories = async () => {
    try{
        const result = await api.get("/categories");
        console.log(result.data);
        return result.data;
    }
    catch(error){
        if(error.response){
            console.log(error.message);
            return null;
        }
        if(error.request){
            
            console.log(error.message);
            return null;
        }
        console.log(error);
    }
}
export const getCategory = async (id) => {
    try{
        const result = await api.get(`/categories/${id}`);
        console.log(result.data);
        return result.data;
    }
    catch(error){
        if(error.response){
            console.log(error.message);
            return null;
        }
        if(error.request){
            
            console.log(error.message);
            return null;
        }
        console.log(error);
    }
}
export default api;