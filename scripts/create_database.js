/**
 * Created by barrett on 8/28/14.
 */

var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + 'USER' + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `username` VARCHAR(50) NOT NULL, \
    `password` CHAR(60) NOT NULL, \
    `role` VARCHAR(60) NOT NULL, \
    `fullName` VARCHAR(300) NOT NULL, \
    `phone` VARCHAR(300), \
    `email` VARCHAR(300), \
    `corpId` VARCHAR(60), \
    `isActive` BOOLEAN NOT NULL DEFAULT 1, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    INDEX `username_UNIQUE` (`username` ASC) \
)');

console.log('Success: Database Created!')

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + 'MT_CORP' + '` ( \
    `id` VARCHAR(50) NOT NULL, \
    `name` VARCHAR(100) NOT NULL, \
    `address` TEXT, \
    `logo` TEXT, \
    `phone` VARCHAR(300), \
    `email` VARCHAR(300), \
    `dt_created` DATETIME NOT NULL, \
    `created_by` INT UNSIGNED NOT NULL, \
    `dt_updated` DATETIME, \
    `updated_by` INT UNSIGNED, \
        PRIMARY KEY (`id`), \
        FOREIGN KEY (`created_by`) REFERENCES PROP.USER(`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `name_UNIQUE` (`name` ASC) \
)');

console.log('Success: Table MT_CORP is Created!')

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + 'MT_CORP_PROJECT' + '` ( \
    `id` VARCHAR(50) NOT NULL, \
    `name` VARCHAR(100) NOT NULL, \
    `corpId` VARCHAR(50) NOT NULL, \
    `start_dt` DATETIME NOT NULL, \
    `end_dt` DATETIME NOT NULL, \
    `logo` TEXT, \
    `dt_created` DATETIME NOT NULL, \
    `created_by` INT UNSIGNED NOT NULL, \
    `dt_updated` DATETIME, \
    `updated_by` INT UNSIGNED, \
        PRIMARY KEY (`id`), \
        FOREIGN KEY (`corpId`) REFERENCES PROP.MT_CORP(`id`), \
        FOREIGN KEY (`created_by`) REFERENCES PROP.USER(`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    INDEX `name_UNIQUE` (`name` ASC), \
    INDEX `corpId_INDEX` (`corpId` ASC) \
)');

console.log('Success: TABLE MT_CORP_PROJECT is Created!')

connection.end();
