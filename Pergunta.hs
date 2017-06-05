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
import Data.Text hiding (replace) 
import Database.Persist.Postgresql
import Foundation
import Network.HTTP.Types.Status

-- Usar o replace do prelude e escondendo o map do data text.

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
    sendStatusJSON ok200 (object ["id" .= (perid), "enunciado" .=(perguntaEnunciado pergunta), "pontos" .=(perguntaPontos pergunta), "categoria" .=(object ["id" .= (perguntaCategoriaId pergunta), "nome" .=(categoriaNome categoria)])]) --  criando na mao o join /joga na tela a busca
    
-- Listar pergunta no Banco de dados
getPerguntaR :: Handler TypedContent
getPerguntaR  = do
    perguntas <- runDB $ selectList ([] :: [Filter Pergunta]) [] -- seleciona as perguntas 
    sendStatusJSON ok200 perguntas -- joga na tela a lista 	{"id" : id, "enunciado" : "tal tal", "pontos" : 800 "categoriaId" : “1”}
    
-- Deletar pergunta no Banco de Dados
deleteBuscarPerguntaR :: PerguntaId -> Handler TypedContent
deleteBuscarPerguntaR perid = do
    _ <- runDB $ get404 perid -- verifica se existe
    runDB $ delete perid -- deleta no banco
    sendStatusJSON noContent204 (object ["id" .= (fromSqlKey perid)]) -- joga na tela
    
-- Alterar pergunta no Banco de dados
putBuscarPerguntaR :: PerguntaId -> Handler TypedContent
putBuscarPerguntaR perid  = do
    pergunta <- requireJsonBody :: Handler Pergunta -- procura
    runDB $ replace perid pergunta -- altera no banco
    sendStatusJSON noContent204 (object ["id" .= (fromSqlKey perid)]) -- joga na tela
