<?php

/**
 * Model: Registro
 * 
 * Representa um registro na tabela 'registros'.
 * Contém métodos para facilitar as buscas e manipulação de dados.
 * 
 * Localização: app/Models/Registro.php
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Registro extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Nome da tabela no banco de dados
     */
    protected $table = 'registros';

    /**
     * Campos que podem ser preenchidos em massa
     * (Mass Assignment Protection)
     */
    protected $fillable = [
        'nome',
        'email',
        'cpf',
        'telefone',
        'cidade',
        'estado',
        'data_nascimento',
        'status',
    ];

    /**
     * Campos que devem ser tratados como datas
     */
    protected $casts = [
        'data_nascimento' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Campos que devem ser ocultados ao serializar
     * (útil para APIs)
     */
    protected $hidden = [
        'deleted_at',
    ];

    /**
     * Scope: Busca apenas registros ativos
     * Uso: Registro::ativos()->get();
     */
    public function scopeAtivos($query)
    {
        return $query->where('status', 'ativo');
    }

    /**
     * Scope: Busca por cidade
     * Uso: Registro::porCidade('São Paulo')->get();
     */
    public function scopePorCidade($query, $cidade)
    {
        return $query->where('cidade', 'LIKE', "%{$cidade}%");
    }

    /**
     * Scope: Busca por estado
     * Uso: Registro::porEstado('SP')->get();
     */
    public function scopePorEstado($query, $estado)
    {
        return $query->where('estado', $estado);
    }

    /**
     * Accessor: Retorna o nome formatado (primeira letra maiúscula)
     */
    public function getNomeFormatadoAttribute()
    {
        return ucwords(strtolower($this->nome));
    }

    /**
     * Accessor: Retorna o CPF formatado (000.000.000-00)
     */
    public function getCpfFormatadoAttribute()
    {
        $cpf = preg_replace('/\D/', '', $this->cpf);
        return preg_replace('/(\d{3})(\d{3})(\d{3})(\d{2})/', '$1.$2.$3-$4', $cpf);
    }

    /**
     * Accessor: Retorna o telefone formatado
     */
    public function getTelefoneFormatadoAttribute()
    {
        if (!$this->telefone) {
            return null;
        }
        
        $telefone = preg_replace('/\D/', '', $this->telefone);
        
        if (strlen($telefone) === 11) {
            return preg_replace('/(\d{2})(\d{5})(\d{4})/', '($1) $2-$3', $telefone);
        }
        
        return preg_replace('/(\d{2})(\d{4})(\d{4})/', '($1) $2-$3', $telefone);
    }

    /**
     * Accessor: Retorna a idade baseada na data de nascimento
     */
    public function getIdadeAttribute()
    {
        return $this->data_nascimento->age;
    }

    /**
     * Mutator: Formata o CPF antes de salvar
     */
    public function setCpfAttribute($value)
    {
        $this->attributes['cpf'] = preg_replace('/\D/', '', $value);
    }

    /**
     * Mutator: Formata o telefone antes de salvar
     */
    public function setTelefoneAttribute($value)
    {
        if ($value) {
            $this->attributes['telefone'] = preg_replace('/\D/', '', $value);
        }
    }

    /**
     * Mutator: Converte o nome para maiúsculas antes de salvar
     */
    public function setNomeAttribute($value)
    {
        $this->attributes['nome'] = strtoupper($value);
    }

    /**
     * Método estático: Retorna o total de registros ativos
     */
    public static function totalAtivos()
    {
        return self::where('status', 'ativo')->count();
    }

    /**
     * Método estático: Retorna estatísticas gerais
     */
    public static function estatisticas()
    {
        return [
            'total' => self::count(),
            'ativos' => self::where('status', 'ativo')->count(),
            'inativos' => self::where('status', 'inativo')->count(),
            'por_estado' => self::selectRaw('estado, COUNT(*) as total')
                ->groupBy('estado')
                ->orderByDesc('total')
                ->get(),
        ];
    }
}