{-# LANGUAGE EmptyDataDecls             #-}
{-# LANGUAGE FlexibleContexts           #-}
{-# LANGUAGE GADTs                      #-}
{-# LANGUAGE GeneralizedNewtypeDeriving #-}
{-# LANGUAGE MultiParamTypeClasses      #-}
{-# LANGUAGE OverloadedStrings          #-}
{-# LANGUAGE QuasiQuotes                #-}
{-# LANGUAGE ViewPatterns               #-}
{-# LANGUAGE TemplateHaskell            #-}
{-# LANGUAGE TypeFamilies               #-}

module Pergunta where

import Yesod
import Database.Persist.Postgresql
import Foundation
import Network.HTTP.Types.Status
import Data.List (find)
import System.Random (randomRIO)
import Utils

-- Criando a pergunta no Banco de dados
postPerguntaR :: Handler TypedContent
postPerguntaR = do
    pergunta <- requireJsonBody :: Handler Pergunta --  {"enunciado": "tal tal", "pontos": "800", "categoriaId": 1}
    perid <- runDB $ insert pergunta -- insiro no DB
    sendStatusJSON created201 (object ["id" .= (fromSqlKey perid)]) -- recupera o id jogando em um json e fala que a chave eh {"id": 1} / crio o recurso no servidor (se add é sucesso)

-- Buscando a pergunta no Banco de dados    
getBuscarPerguntaR :: PerguntaId -> Handler TypedContent
getBuscarPerguntaR perid = do
    pergunta <- runDB $ get404 perid  -- se o id existe ele retorna (busca no banco) / select no banco
    categoria <- runDB $ get404 (perguntaCategoriaId pergunta) -- pegar o id e nome da categoria
    alternativas <- runDB $ selectList [AlternativaPerguntaId ==. perid ] [] -- seleciona as alternativas dessa pergunta
    sendStatusJSON ok200 (object ["alternativas".= (alternativas), "id" .= (perid), "enunciado" .=(perguntaEnunciado pergunta), "pontos" .=(perguntaPontos pergunta), "categoria" .=(object ["id" .= (perguntaCategoriaId pergunta), "nome" .=(categoriaNome categoria)])]) --  criando na mao o join /joga na tela a busca
    -- {"pontos":8000,"categoria":{"nome":"Esportes","id":1},"id":2,"enunciado":"tal tal tal","alternativas":[]}
    
-- Listar pergunta no Banco de dados
-- TO DO listar pergunta e suas alternativas {“id” : id, “enunciado” : “e”, “categoria” : “Geografia”,“alternativas”: [	{“id” :”id”,“texto”: “texto”“certa” : false}...]}
getPerguntaR :: Handler TypedContent
getPerguntaR  = 

    let getCategoria cid ls = do
        case (find (\(Entity catid _) -> catid == cid) ls) of
            Nothing -> "Desconhecido"
            Just (Entity _ c) -> (categoriaNome c)
    in do
    perguntas <- runDB $ selectList ([] :: [Filter Pergunta]) [] -- seleciona as perguntas 
    categorias <- runDB $ selectList ([] :: [Filter Categoria]) [] -- seleciona as perguntas 
    resultado <- return $ map (\(Entity pid p) -> object ["id" .= pid, "categoria" .= getCategoria (perguntaCategoriaId p) categorias, "enunciado" .= perguntaEnunciado p, "pontos" .= perguntaPontos p]) perguntas
    sendStatusJSON ok200 resultado -- joga na tela a lista 	{"id" : id, "enunciado" : "tal tal", "pontos" : 800 "categoriaId" : “1”}
    
-- Deletar pergunta no Banco de Dados
deleteBuscarPerguntaR :: PerguntaId -> Handler TypedContent
deleteBuscarPerguntaR perid = do
    _ <- runDB $ get404 perid -- verifica se existe
    runDB $ deleteCascade perid -- deleta no banco
    sendStatusJSON ok200 (object ["id" .= (fromSqlKey perid)]) -- joga na tela
    
-- Alterar pergunta no Banco de dados
putBuscarPerguntaR :: PerguntaId -> Handler TypedContent
putBuscarPerguntaR perid  = do
    pergunta <- requireJsonBody :: Handler Pergunta -- procura
    runDB $ replace perid pergunta -- altera no banco
    sendStatusJSON ok200 (object ["id" .= (fromSqlKey perid)]) -- joga na tela

getRandPerguntaR :: Handler TypedContent
getRandPerguntaR = do
    enableCors
    perguntas <- runDB $ selectList ([] :: [Filter Pergunta]) []
    aleatoria <- liftIO $ fmap (perguntas !!) $ randomRIO (0, length perguntas - 1)
    let pid = ((\(Entity key _) -> key) aleatoria)
    let p = ((\(Entity _ perg) -> perg) aleatoria)
    alternativas <- runDB $ selectList [AlternativaPerguntaId ==. pid] []
    categoria <- runDB $ get404 (perguntaCategoriaId p)
    sendStatusJSON ok200 (object ["id" .= pid,"enunciado" .= (perguntaEnunciado p), "pontos" .= (perguntaPontos p), "categoria" .= (categoriaNome categoria), "alternativas" .= alternativas])
