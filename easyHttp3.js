class EasyHTTP {

    //GET http request
    async get(url) {
    
        const response = await fetch(url)
   
        const responseData = await response.json();
        return responseData;
    }

    //POST http request
    async post(url, data) {
        const response = await fetch(url, {
                method : 'POST',
                headers : {
                    'Content-type' : 'application/json'
                },
                body : JSON.stringify(data)
            });
        const responseData = await response.json();
        return responseData;
    }

    //PUT http request
    async put(url, data) {

        const response = await fetch(url, {
                method : 'PUT',
                headers : {
                    'Content-type' : 'application/json'
                },
                body : JSON.stringify(data)
            });
        const responseData = await response.json();
        return responseData;
    }

    //DELETE http request
    async delete(url) {
        const response = await fetch(url, {
                method : 'DELETE',
                headers : {
                    'Content-type' : 'application/json'
                }
            })
        const responseData = await response.json();
        return responseData;
    }
}