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

routes.get('/deletarmembro/:id/:membroid', gruposController.deletarMembro);


routes.get('/', gruposController.listar);

routes.get('/meusgrupos', gruposController.listarmeusgrupos);

routes.get('/meusgrupos/page/:num', gruposController.paginacaomgrupos);
routes.get('/page/:num', gruposController.paginacao);
routes.get('/:id/page/:num', gruposController.paginacaomensagem);


routes.get('/:id', gruposController.detalhar);

routes.post('/', gruposController.cadastrar);


routes.post('/:id/add', gruposController.cadastrarusuario);
routes.post('/:id/addmensagem', gruposController.cadastrarmensagem);



routes.get('/alterar/:id', gruposController.mostraAlterar);
routes.post('/alterar/:id', gruposController.alterar);

module.exports = routes;