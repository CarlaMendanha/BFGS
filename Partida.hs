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

module Partida where

import Yesod
import Database.Persist.Postgresql
import Foundation
import Network.HTTP.Types.Status
import Utils
import Data.List (find)
import Data.Text hiding (find)
import Utils

postPartidaR :: Handler TypedContent
postPartidaR = do
    enableCors
    partida <- requireJsonBody :: Handler Partida -- {"usuarioId": 1, "pontuacao": 8000, "dia" : "2017-06-01 19:20:14"}
    parid <- runDB $ insert partida -- inserindo a partida no Banco de dados
    sendStatusJSON created201 (object ["id" .= (fromSqlKey parid)]) -- mostrar que o id novo foi inserido 

getPlacarR :: Handler TypedContent
getPlacarR = do
    enableCors
    partidas <- runDB $ selectList [] [Desc PartidaPontuacao, LimitTo 5]
    usuarioIds <- return $ fmap (partidaUsuarioId . entityVal) partidas
    usuarios <- runDB $ selectList [UsuarioId <-. usuarioIds] []
    json <- return $ fmap (\(Entity _ p) -> object ["pontuacao" .= partidaPontuacao p, "data" .= partidaDia p, "usuario" .=  pegarNome (find (\u -> entityKey u == partidaUsuarioId p) usuarios)]) partidas
    sendStatusJSON ok200 json

pegarNome :: Maybe (Entity Usuario) -> Text
pegarNome Nothing = pack "Faustão"
pegarNome (Just (Entity _ u)) = usuarioNome u