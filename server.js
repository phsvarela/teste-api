const express = require("express");
const SUCCESS_RESPONSE_STATUS = 200;
const CLIENT_ERROR_STATUS = 400;
const SERVER_ERROR_STATUS = 500;
const app = express();
const PORT = "3000";
let task = [];
let currentId = 1;

app.use(express.json());

app.get("/servico", (request, response) => {
    return response.status(HttpStatus.CLIENT_ERROR_STATUS).json("Serviço em construção!")
})

app.post("/cadastro", (request, response) => {
    try {
        let bodyRequest = request.body;

        if (!bodyRequest.titulo || !bodyRequest.descricao || !bodyRequest.status)
            return response.status(CLIENT_ERROR_STATUS).json("Corpo do JSON incompleto!");

        let newTask = {
            id: currentId++,
            titulo: bodyRequest.titulo,
            descricao: bodyRequest.descricao,
            status: bodyRequest.status
        };

        task.push(newTask);

        return response.status(SUCCESS_RESPONSE_STATUS).json("Cadastro efetuado com sucesso!");
    } catch (error) {
        return response.status(SERVER_ERROR_STATUS).json("Erro ao salvar recurso");
    }
})

app.get("/find-task", (request, response) => {
    return response.status(SUCCESS_RESPONSE_STATUS).json(task);
})

app.get("/find-task/:id", (request, response) => {
    try {
        let idRequest = request.params.id;

        const respose = task.find(task => task.id == idRequest)

        if (!response) return response.status(SUCCESS_RESPONSE_STATUS).json("Recurso não encontrado");

        return response.status(SUCCESS_RESPONSE_STATUS).json(respose);
    } catch (error) {
        return response.status(SERVER_ERROR_STATUS).json("Erro ao buscar recurso");
    }
})

app.delete("/delete-task/:id", (request, response) => {
    try {
        let idRequest = request.params.id;

        const taskToDelete = task.find(task => task.id == idRequest);

        if (!taskToDelete) return response.status(SUCCESS_RESPONSE_STATUS).json("Recurso não encontrado");
        
        const taskIndex = task.findIndex(task => task.id == idRequest)

        const deleted = task.splice(taskIndex, 1);

        if (deleted == 0) return response.status(SERVER_ERROR_STATUS).json("Não foi possível excluir o recurso")

        return response.status(SUCCESS_RESPONSE_STATUS).json("Recurso excluído com sucesso!")
    } catch (error) {
        return response.status(SERVER_ERROR_STATUS).json("Erro ao buscar recurso");
    }
})

app.put("/atualiza-task/:id", (request, response) => {
    try {
        let idRequest = request.params.id;
        let bodyRequest = request.body;

        if (!bodyRequest.titulo || !bodyRequest.descricao || !bodyRequest.status)
            return response.status(CLIENT_ERROR_STATUS).json("Corpo do JSON incompleto!");

        const taskIndex = task.findIndex(task => task.id == idRequest);

        if(taskIndex == -1) return response.status(CLIENT_ERROR_STATUS).json("Recuso não encontrado");

        let taskToUpdate = task[taskIndex];
        taskToUpdate.titulo = bodyRequest.titulo;
        taskToUpdate.descricao = bodyRequest.descricao;
        taskToUpdate.status = bodyRequest.status;

        const update = task.splice(taskIndex, 1, taskToUpdate);

        if (update == 0) return response.status(SERVER_ERROR_STATUS).json("Não foi possível atualizar o recurso")

        return response.status(SUCCESS_RESPONSE_STATUS).json("Recurso atualizado com sucesso!")
    } catch (error) {
        return response.status(SERVER_ERROR_STATUS).json("Erro ao buscar recurso");
    }
})


app.listen(PORT, () => {
    console.log("Server Init in Port", PORT);
})