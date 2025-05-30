<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AccountCreated extends Notification
{
    use Queueable;
    protected $user;
    protected $plainPassword;

    /**
     * Create a new notification instance.
     */
    public function __construct($user, $plainPassword = null)
    {
        $this->user = $user;
        $this->plainPassword = $plainPassword;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        $divisionName = optional($this->user->division)->name ?? '-';
        $storeName = optional($this->user->store)->name ?? '-';
        $role = $this->user->role;

        $mail = (new MailMessage)
            ->subject('Akun Anda sebagai ' . ucfirst($role) . ' Telah Dibuat')
            ->greeting('Halo, ' . $this->user->name)
            ->line("Akun Anda sebagai **$role** telah berhasil dibuat.")
            ->line('Email: ' . $this->user->email)
            ->line('Divisi: ' . $divisionName)
            ->line('Toko: ' . $storeName);

        if (in_array($role, ['admin', 'user']) && $this->plainPassword) {
            $mail->line('Password: ' . $this->plainPassword);
        }

        return $mail
            ->action('Login Sekarang', url('/login'))
            ->line('Silakan ubah password setelah login jika diperlukan.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
