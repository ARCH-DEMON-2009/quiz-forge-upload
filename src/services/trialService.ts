
import { supabase } from '@/lib/supabase';
import { getOrCreateDeviceId } from './deviceService';

export interface UserTrial {
  device_id: string;
  trial_start: string;
}

export interface PremiumUser {
  id: string;
  name: string;
  device_id: string;
  payment_id: string;
  purchased_at: string;
  expires_at: string;
}

export type TrialStatus = 'loading' | 'active' | 'expired' | 'premium';

export const checkTrialStatus = async (): Promise<TrialStatus> => {
  try {
    const deviceId = getOrCreateDeviceId();
    
    // First check if user is premium
    const { data: premiumUser, error: premiumError } = await supabase
      .from('premium_users')
      .select('*')
      .eq('device_id', deviceId)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (premiumError && premiumError.code !== 'PGRST116') {
      console.error('Error checking premium status:', premiumError);
    }

    if (premiumUser) {
      return 'premium';
    }

    // Check trial status
    const { data: trial, error: trialError } = await supabase
      .from('user_trials')
      .select('*')
      .eq('device_id', deviceId)
      .single();

    if (trialError && trialError.code !== 'PGRST116') {
      console.error('Error checking trial status:', trialError);
      return 'expired';
    }

    if (!trial) {
      // Create new trial
      const startDate = new Date();

      const { error: insertError } = await supabase
        .from('user_trials')
        .insert({
          device_id: deviceId,
          trial_start: startDate.toISOString()
        });

      if (insertError) {
        console.error('Error creating trial:', insertError);
        return 'expired';
      }

      return 'active';
    }

    // Check if trial is still active (3 days from start)
    const trialStart = new Date(trial.trial_start);
    const trialEnd = new Date(trialStart.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days
    const now = new Date();
    
    return now < trialEnd ? 'active' : 'expired';
  } catch (error) {
    console.error('Error in checkTrialStatus:', error);
    return 'expired';
  }
};

export const createPremiumUser = async (name: string, paymentId: string): Promise<boolean> => {
  try {
    const deviceId = getOrCreateDeviceId();
    const purchaseDate = new Date();
    const expiryDate = new Date(purchaseDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const { error } = await supabase
      .from('premium_users')
      .insert({
        name,
        device_id: deviceId,
        payment_id: paymentId,
        purchased_at: purchaseDate.toISOString(),
        expires_at: expiryDate.toISOString()
      });

    if (error) {
      console.error('Error creating premium user:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in createPremiumUser:', error);
    return false;
  }
};
