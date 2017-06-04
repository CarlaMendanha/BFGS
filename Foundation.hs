{-# LANGUAGE EmptyDataDecls             #-}
{-# LANGUAGE FlexibleContexts           #-}
{-# LANGUAGE GADTs                      #-}
{-# LANGUAGE GeneralizedNewtypeDeriving #-}
{-# LANGUAGE MultiParamTypeClasses      #-}
{-# LANGUAGE OverloadedStrings          #-}
{-# LANGUAGE QuasiQuotes                #-}
{-# LANGUAGE ViewPatterns               #-}
{-# LANGUAGE TemplateHaskell            #-}
{-# LANGUAGE FlexibleInstances          #-}
{-# LANGUAGE TypeFamilies               #-}
module Foundation where

import Yesod
import Data.Text
import Data.Time.Calendar
import Database.Persist
import Database.Persist.Postgresql

data App = App
    {
        connPool       :: ConnectionPool
    }


share [mkPersist sqlSettings, mkMigrate "migrateAll"] [persistLowerCase|
    Usuario json
        nome Text
        email Text
        senha Text
        deriving Show   
     
    Pergunta json
        enunciado Text
        pontos Int
        categoriaId CategoriaId
        deriving Show
     
    Alternativa json
        texto Text
        certa Bool
        perguntaId PerguntaId
        deriving Show
     
    Categoria json
        nome Text
        deriving Show
     
    Partida json
        pontuacao Int
        dia Day
        usuarioId UsuarioId
        deriving Show
|]


mkYesodData "App" $(parseRoutesFile "routes")

instance Yesod App

instance YesodPersist App where
   type YesodPersistBackend App = SqlBackend
   runDB f = do
       master <- getYesod
       let pool = connPool master
       runSqlPool f pool