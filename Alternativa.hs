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

module Alternativa where

import Yesod
import Database.Persist.Postgresql
import Foundation
import Network.HTTP.Types.Status
import Data.List (find)

postAlternativaR :: Handler TypedContent
postAlternativaR = do
    alternativa <- requireJsonBody :: Handler Alternativa
    altid <- runDB $ insert alternativa
    sendStatusJSON created201 (object ["id" .= (fromSqlKey altid)])

deleteBuscarAlternativaR :: AlternativaId -> Handler TypedContent
deleteBuscarAlternativaR altid = do
    _ <- runDB $ get404 altid
    runDB $ delete altid
    sendStatusJSON ok200 (object ["id" .= (fromSqlKey altid)])

getBuscarAlternativaR :: AlternativaId ->  Handler TypedContent
getBuscarAlternativaR altid = do
    alternativa <- runDB $ get404 altid
    sendStatusJSON ok200 (object ["alternativa" .= alternativa, "id" .= (altid)] )

putBuscarAlternativaR :: AlternativaId -> Handler TypedContent
putBuscarAlternativaR altid = do
    alternativa <- requireJsonBody :: Handler Alternativa
    runDB $ replace altid alternativa
    sendStatusJSON ok200 (object ["id" .= (fromSqlKey altid)])
