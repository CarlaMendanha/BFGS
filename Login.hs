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

module Login where

import Yesod
import Data.Text
import Database.Persist.Postgresql
import Foundation
import Network.HTTP.Types.Status
import Codec.Digest.SHA
import Data.ByteString.Char8
import Utils

hashPassword :: Text -> Text
hashPassword original = Data.Text.pack . showBSasHex . (hash SHA256) . Data.ByteString.Char8.pack $ "essa-fera-ai-meu" ++ (Data.Text.unpack original)

postCadastroR :: Handler TypedContent
postCadastroR = do
    enableCors
    u <- requireJsonBody :: Handler Usuario -- nome, email e senha
    uid <- runDB $ insert (Usuario (usuarioNome u) (usuarioEmail u) (hashPassword $ usuarioSenha u))
    sendStatusJSON created201 (object ["id" .= (fromSqlKey uid)])

getLoginR :: Text -> Text -> Handler TypedContent
getLoginR email senha = do
    enableCors
    usuario <- runDB $ selectFirst [UsuarioEmail ==. email,UsuarioSenha ==. (hashPassword senha)] []
    case usuario of
        Nothing -> do
            notFound
        Just (Entity uid u) -> do
            sendStatusJSON ok200 (object ["id" .= (fromSqlKey uid), "nome" .= (usuarioNome u)])