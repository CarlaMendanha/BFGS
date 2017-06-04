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
