const { Router } = require('express');

// IMPORTAÇÃO DO grupos-CONTROLLER
// CONST NOME-RECURSO = REQUIRE(ARQUIVO);
const { GruposController } = require('../controllers/grupos-controller');

// const Router = require('express').Router

// const express = require('express')
// const Router = express.Router

// O NOSSO ROUTER COMEÇA COM /grupos
const routes = Router();

const gruposController = new GruposController();

routes.get('/cadastrar', gruposController.mostraCadastro);

routes.get('/deletar/:id', gruposController.deletar);

routes.get('/', gruposController.listar);

routes.get('/:id', gruposController.detalhar);

routes.post('/', gruposController.cadastrar);

routes.get('/alterar/:id', gruposController.mostraAlterar);
routes.post('/alterar/:id', gruposController.alterar);

module.exports = routes;