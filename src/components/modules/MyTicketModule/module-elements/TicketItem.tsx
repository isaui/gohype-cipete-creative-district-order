import React from 'react';
import { TicketItemProps } from '../interface';
import { QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { formatTime } from '@/utils/formatTime';
import { MONTH_NAMES } from '@/constant';

export const TicketItem: React.FC<TicketItemProps> = ({
  id,
  title,
  variant,
  isCheckedIn,
  validDate: validDateStr,
  checkInDate,
  duration,
  isWeekend,
  qrCodeImageUrl,
}) => {
  let checkOutDate;
  if (checkInDate) {
    checkOutDate = new Date(checkInDate);
    checkOutDate.setMinutes(checkOutDate.getMinutes() + duration);
  }

  const validDate = new Date(validDateStr);

  return (
    <div className="drop-shadow-md p-2 sm:p-6 rounded-lg sm:rounded-2xl bg-white border border-[#F3F3F3] flex flex-col md:flex-row gap-4">
      <div className="w-full flex flex-col gap-3">
        <div className="flex flex-col">
          <span className="text-sm hidden sm:block text-[#606060]">
            ID: #{id}
          </span>
          <h2 className="text-base sm:text-xl font-semibold">{title}</h2>
          <h3 className="text-sm sm:text-base text-[#606060]">{variant}</h3>
        </div>
        {isCheckedIn && checkInDate && checkOutDate ? (
          <div className="font-semibold text-xs sm:text-sm flex flex-col gap-1 bg-[#FFFAF1] border border-[#F0E3CD] p-3">
            <span className="flex gap-1 flex-col sm:flex-row">
              <span className="whitespace-nowrap">First time checked in: </span>
              <span className="font-bold text-[#FF7A00]">
                {formatTime(checkInDate)}
              </span>
            </span>
            <span className="flex gap-1 flex-col sm:flex-row">
              <span className="whitespace-nowrap">Play time expires at: </span>
              <span className="font-bold text-[#FF7A00]">
                {formatTime(checkOutDate.toISOString())} ({duration} minutes
                remaining)
              </span>
            </span>
          </div>
        ) : (
          <span className="text-[#0075FF] font-medium">
            Valid until {validDate.getUTCDate()}{' '}
            {MONTH_NAMES[validDate.getUTCMonth()]} {validDate.getUTCFullYear()}{' '}
            only on {isWeekend ? 'weekends' : 'weekdays'}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 min-w-48">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full flex items-center gap-2">
              <span>Open QR Code</span> <QrCode size={18} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tickets</DialogTitle>
              <DialogDescription>ID: #{id} </DialogDescription>
            </DialogHeader>
            <div className="aspect-square w-2/3 max-w-64 mx-auto relative">
              <Image
                alt={`Ticket-${id}`}
                src={qrCodeImageUrl}
                fill
                className="object-contain"
              />
            </div>
            <DialogFooter>
              <div className="flex flex-col w-full items-center">
                <span className="text-base sm:text-lg md:text-xl font-semibold text-center">
                  {title}
                </span>
                <span className="text-sm sm:text-base text-[#606060] text-center">
                  {variant}
                </span>{' '}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Link href={`/my-tickets/${id}`}>
          <Button variant={'secondary'} className="w-full">
            See Details
          </Button>
        </Link>
      </div>
    </div>
  );
};
