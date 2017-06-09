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

postPartidaR :: Handler TypedContent
postPartidaR = do
    enableCors
    partida <- requireJsonBody :: Handler Partida -- {"usuarioId": 1, "pontuacao": 8000, "dia" : "2017-06-01 19:20:14"}
    parid <- runDB $ insert partida -- inserindo a partida no Banco de dados
    sendStatusJSON created201 (object ["id" .= (fromSqlKey parid)]) -- mostrar que o id novo foi inserido 

getPlacarR :: Handler TypedContent
getPlacarR = do
    partidas <- runDB $ selectList [] [Desc PartidaPontuacao, LimitTo 5]
    sendStatusJSON ok200 partidas

