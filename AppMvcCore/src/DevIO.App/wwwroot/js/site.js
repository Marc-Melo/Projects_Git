function AjaxModal() {

    $(document).ready(function () {
        $(function () {
            $.ajaxSetup({ cache: false });

            $("a[data-modal]").on("click",
                function (e) {
                    $('#myModalContent').load(this.href,
                        function () {
                            $('#myModal').modal({
                                keyboard: true
                            }, 'show');
                            bindForm(this);
                        });
                    return false;
                });
        });

        function bindForm(dialog) {
            $('form', dialog).submit(function () {
                $.ajax({
                    url: this.action,
                    type: this.method,
                    data: $(this).serialize(),
                    success: function (result) {
                        if (result.success) {
                            $('#myModal').modal('hide');
                            $('#enderecoTarget').load(result.url);
                        } else {
                            $('#myModalContent').html(result);
                            bindForm(dialog);
                        }
                    }
                });
                return false;
            });
        }
    });
}

function BuscaCep() {
    $(document).ready(function () {

        function limpa_formulario_cep() {
            $("#Endereco_Logradouro").val("");
            $("#Endereco_Bairro").val("");
            $("#Endereco_Cidade").val("");
            $("#Endereco_Estado").val("");
        }

        $('#Endereco_Cep').blur(function () {

            //Nova varíável cep apenas com dígitos
            var cep = $(this).val().replace(/\D/g, '');

            //Verifica se o campo cep possui valor informado
            if (cep !== '') {

                //Expressão regular para validar o cep
                var validaCep = /^[0-9]{8}$/;

                //Valida o formato do cep
                if (validaCep.test(cep)) {

                    //Preenche os campos com '...' enquanto consulta webservice
                    $("#Endereco_Logradouro").val("...");
                    $("#Endereco_Bairro").val("...");
                    $("#Endereco_Cidade").val("...");
                    $("#Endereco_Estado").val("...");

                    //Consulta o webservice
                    $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?",
                        function (dados) {

                            if (!("erro" in dados)) {
                                //Atualiza os campos com os valores das consultas
                                $("#Endereco_Logradouro").val(dados.logradouro);
                                $("#Endereco_Bairro").val(dados.bairro);
                                $("#Endereco_Cidade").val(dados.localidade);
                                $("#Endereco_Estado").val(dados.uf);
                            } else {
                                //Cep pesquisado não foi encontrado
                                limpa_formulario_cep();
                                alert("Cep não encontrado!");
                            }
                        });
                }
                else {
                    //formato inválido
                    limpa_formulario_cep();
                    alert("Formato de Cep inválido!");
                }
            }
            else {
                //cep sem valor, limpa o formulário
                limpa_formulario_cep();
            }
        });
    });
}