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

postCadastroR :: Handler TypedContent
postCadastroR = do
    usuario <- requireJsonBody :: Handler Usuario -- nome, email e senha
    uid <- runDB $ insert usuario
    sendStatusJSON created201 (object ["id" .= (fromSqlKey uid)])