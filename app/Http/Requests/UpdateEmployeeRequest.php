<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeeRequest extends FormRequest
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
        $employee  = $this->route('employee');
        $employeeId = $employee instanceof User ? $employee->id : $employee;

        return [
            'name' => ['required', 'string', 'max:100'],
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($employeeId),
            ],
            'role' => ['required', 'string', 'in:admin,employee,user'],
            'status' => ['required', 'boolean'],
            'division_id' => ['required', 'exists:divisions,id'],
            'employee_id' => ['nullable', 'exists:stores,id'],
        ];
    }
}
