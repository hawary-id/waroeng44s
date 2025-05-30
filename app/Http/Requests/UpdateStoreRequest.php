<?php

namespace App\Http\Requests;

use App\Models\Store;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $store  = $this->route('store');
        $storeId = $store instanceof Store ? $store->id : $store;

        return [
            'name' => ['required', 'string', 'max:100'],
            'address' => ['nullable', 'string'],
            'phone' => [
                'nullable',
                'string',
                Rule::unique('stores', 'phone')->ignore($storeId),
            ],
            'email' => [
                'nullable',
                'email',
                Rule::unique('stores', 'email')->ignore($storeId),
            ],
        ];
    }
}
