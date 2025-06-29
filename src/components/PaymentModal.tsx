
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Crown, CreditCard } from 'lucide-react';
import { processPayment } from '@/services/paymentService';
import { useToast } from '@/hooks/use-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const [userName, setUserName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!userName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to proceed with payment",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const success = await processPayment(userName.trim());
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 justify-center">
            <img src="/logo.jpg" alt="Test Sagar" className="w-8 h-8 rounded-full" />
            <Crown className="w-6 h-6 text-yellow-500" />
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription>
            Get unlimited access to all tests for 30 days
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">₹299</div>
            <div className="text-gray-600">30 Days Premium Access</div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <Input
                id="userName"
                type="text"
                placeholder="Enter your full name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                disabled={isProcessing}
              />
            </div>

            <Button 
              onClick={handlePayment}
              disabled={isProcessing || !userName.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {isProcessing ? 'Processing...' : 'Pay ₹299'}
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Secure payment powered by Test Sagar
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
