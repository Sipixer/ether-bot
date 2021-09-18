-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : sam. 18 sep. 2021 à 12:00
-- Version du serveur :  5.7.31
-- Version de PHP : 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `www`
--

-- --------------------------------------------------------

--
-- Structure de la table `discordlink`
--

DROP TABLE IF EXISTS `discordlink`;
CREATE TABLE IF NOT EXISTS `discordlink` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `DiscordID` varchar(50) NOT NULL,
  `uuid` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `formations`
--

DROP TABLE IF EXISTS `formations`;
CREATE TABLE IF NOT EXISTS `formations` (
  `id` varchar(50) NOT NULL,
  `Nom` varchar(50) NOT NULL,
  `Langue` varchar(50) NOT NULL,
  `Description` varchar(50) NOT NULL,
  `Niveau` varchar(50) NOT NULL,
  `Prix` varchar(50) NOT NULL,
  `CategorieID` varchar(50) NOT NULL,
  `ChannelInfoID` varchar(50) NOT NULL,
  `Duree` varchar(50) NOT NULL,
  `ADiscordID` varchar(50) NOT NULL,
  `StudentRoleID` varchar(50) NOT NULL,
  `AdminRoleID` varchar(50) NOT NULL,
  `MessageInscriptionID` varchar(50) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `student`
--

DROP TABLE IF EXISTS `student`;
CREATE TABLE IF NOT EXISTS `student` (
  `DiscordID` varchar(50) NOT NULL,
  `formationsID` varchar(50) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `mail` varchar(50) NOT NULL,
  `password` varchar(1500) NOT NULL,
  `BattleTag` varchar(50) DEFAULT NULL,
  `DiscordID` varchar(50) DEFAULT NULL,
  `Formateur` int(1) NOT NULL DEFAULT '0',
  `GTournois` int(1) NOT NULL DEFAULT '0',
  `Admin` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
