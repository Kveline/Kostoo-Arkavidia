-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 08, 2020 at 09:09 AM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 7.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `arkav`
--

-- --------------------------------------------------------

--
-- Table structure for table `desa`
--

CREATE TABLE `desa` (
  `id_desa` int(11) NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `nama_desa` varchar(12) DEFAULT NULL,
  `lokasi` varchar(24) DEFAULT NULL,
  `portofolio` text DEFAULT NULL,
  `foto` text DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `bidang_dikuasai` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `investor`
--

CREATE TABLE `investor` (
  `id_investor` int(11) NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `nama_perusahaan` text DEFAULT NULL,
  `lokasi` text DEFAULT NULL,
  `foto_perusahaan` text DEFAULT NULL,
  `deskripsi_perusahaan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `progress_proyek`
--

CREATE TABLE `progress_proyek` (
  `id_progress` int(11) NOT NULL,
  `id_proyek` int(11) NOT NULL,
  `tanggal_progress` datetime DEFAULT NULL,
  `deskripsi_progress` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `proyek`
--

CREATE TABLE `proyek` (
  `id_proyek` int(11) NOT NULL,
  `id_investor` int(11) NOT NULL,
  `id_desa` int(11) NOT NULL,
  `nama_proyek` int(11) NOT NULL,
  `status` text NOT NULL,
  `waktu_proyek_mulai` datetime DEFAULT NULL,
  `waktu_target_selesai` datetime DEFAULT NULL,
  `mou_kerjasama` text DEFAULT NULL,
  `selesai` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `desa`
--
ALTER TABLE `desa`
  ADD PRIMARY KEY (`id_desa`);

--
-- Indexes for table `investor`
--
ALTER TABLE `investor`
  ADD PRIMARY KEY (`id_investor`);

--
-- Indexes for table `progress_proyek`
--
ALTER TABLE `progress_proyek`
  ADD PRIMARY KEY (`id_progress`),
  ADD KEY `id_proyek` (`id_proyek`);

--
-- Indexes for table `proyek`
--
ALTER TABLE `proyek`
  ADD PRIMARY KEY (`id_proyek`),
  ADD KEY `id_investor` (`id_investor`),
  ADD KEY `id_desa` (`id_desa`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `desa`
--
ALTER TABLE `desa`
  MODIFY `id_desa` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `investor`
--
ALTER TABLE `investor`
  MODIFY `id_investor` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `progress_proyek`
--
ALTER TABLE `progress_proyek`
  MODIFY `id_progress` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `proyek`
--
ALTER TABLE `proyek`
  MODIFY `id_proyek` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `progress_proyek`
--
ALTER TABLE `progress_proyek`
  ADD CONSTRAINT `progress_proyek_ibfk_1` FOREIGN KEY (`id_proyek`) REFERENCES `proyek` (`id_proyek`);

--
-- Constraints for table `proyek`
--
ALTER TABLE `proyek`
  ADD CONSTRAINT `proyek_ibfk_1` FOREIGN KEY (`id_investor`) REFERENCES `investor` (`id_investor`),
  ADD CONSTRAINT `proyek_ibfk_2` FOREIGN KEY (`id_desa`) REFERENCES `desa` (`id_desa`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
