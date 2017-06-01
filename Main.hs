{-# LANGUAGE OverloadedStrings          #-}
import Application () -- for YesodDispatch instance
import Foundation
import Yesod
import Control.Monad.Logger (runStdoutLoggingT)
import Database.Persist.Postgresql
import Data.Text
import Data.Text.Encoding

connStr :: Text
connStr = "dbname=d3c2fkni2plsi2 host=ec2-54-243-185-132.compute-1.amazonaws.com user=gzzeivjwbvoqcw password=b16ecef2f6837fe02581458200cc3d7b29674164f57ca6724f33a148090dca54 port=5432"

main :: IO ()
main = runStdoutLoggingT $ withPostgresqlPool (encodeUtf8 connStr) 10 $ \pool -> liftIO $ do
    runSqlPersistMPool (runMigration migrateAll) pool 
    warp 8080 (App pool)
