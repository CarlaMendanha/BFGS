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

module Categoria where

import Yesod
import Foundation
import Network.HTTP.Types.Status

getCategoriaR :: Handler TypedContent
getCategoriaR = do
    categorias <- runDB $ selectList ([] :: [Filter Categoria]) []
    sendStatusJSON ok200 categorias

postCategoriaR :: Handler TypedContent
postCategoriaR = do
    categoria <- requireJsonBody :: Handler Categoria
    cid <- runDB $ insert categoria
    sendStatusJSON created201 (object ["id" .= cid])