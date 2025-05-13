"use client";
import { usePrivy } from '@privy-io/react-auth';
import { Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserWalletSheet } from '../components/SheetWithStacking/UserWalletSheet';
export default function WalletMoney() {

  return (
    <UserWalletSheet />
  );
}
