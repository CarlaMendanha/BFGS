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
import Data.Text
import Database.Persist.Postgresql
import Foundation
import Network.HTTP.Types.Status

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