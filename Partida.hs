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
import Data.Text
import Database.Persist.Postgresql
import Foundation
import Network.HTTP.Types.Status

postPartidaR :: Handler TypedContent
postPartidaR = do
    partida <- requireJsonBody :: Handler Partida -- {"usuarioId": 1, "pontuacao": 8000, "dia" : "2017-06-01 19:20:14"}
    parid <- runDB $ insert partida -- inserindo a partida no Banco de dados
    sendStatusJSON created201 (object ["id" .= (fromSqlKey parid)]) -- mostrar que o id novo foi inserido 

