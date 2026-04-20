<?php

namespace App\Notifications;

use App\Models\PaymentLink;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class PaymentSuccessful extends Notification
{
    use Queueable;

    public function __construct(protected PaymentLink $paymentLink)
    {
        //
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Payment Completed',
            'message' => 'A payment was successfully completed.',
            'payment_link_id' => $this->paymentLink->id,
            'tx_ref' => $this->paymentLink->tx_ref,
            'amount' => $this->paymentLink->amount,
            'merchant' => $this->paymentLink->business?->name ?? null,
        ];
    }

    public function toArray($notifiable)
    {
        return $this->toDatabase($notifiable);
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Payment Completed Successfully')
            ->line('A payment for your link has been completed successfully.')
            ->line('Reference: ' . $this->paymentLink->tx_ref)
            ->line('Amount: ' . $this->paymentLink->amount)
            ->action('View Payment Link', url('/payment-links/' . $this->paymentLink->id));
    }
}
